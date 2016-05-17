'use strict';

angular.module('RTPoll.controllers', [])
    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService, $ionicPopup, $ionicHistory) {
        let login = this;
        login.user = 'Anonymous';

        function handleLoginSuccess(user){
            onLogin();
            login.user = user || 'Anonymous';
            console.debug('successful login ', login.user);
        }

        function showLogin(){
            console.debug('show login');
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true,
                historyRoot: true
            });
            $state.go('app.login');
        }

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(handleLoginSuccess(login.email),  (error) => {
                    login.user = '';
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            handleLoginSuccess();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $ionicHistory.nextViewOptions({
                disableAnimate: false,
                disableBack: true,
                historyRoot: true
            });
            $state.go('app.sessions');
        }

        function signout() {
            console.debug('signout');
            LoginService.signout()
                .then( () => {
                    let alertPopup = $ionicPopup.alert({
                        title: 'Logged out',
                        template: 'User: ' + login.user
                    });

                    alertPopup.then((res) => {
                        $state.go('app.login');
                        login.user = 'Anonymous';
                        $rootScope.$broadcast('logout');
                        $state.go($state.current, {}, {reload: true});
                    });
                })

        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
        login.showLogin = showLogin;
    })    

    .controller('EditCtrl', function (SessionsModel, $stateParams, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let edit = this;
        edit.id = $stateParams.id;
        edit.session = {};

        function fetch(id) {
            SessionsModel.fetch(id)
                .then( (result) => {
                    edit.session = result;
                    console.debug('r:', result);
                });
        }

        function update(object) {
            console.debug('update: ', object);
            SessionsModel.update(object.id, object)
                .then( (result) => {
                    $ionicHistory.goBack();
                });
        }

        $scope.$on("$ionicView.enter", function () {
            edit.fetch(edit.id);
        });

        edit.fetch = fetch;
        edit.update = update;
    })

    .controller('PollCtrl', function (SessionsModel, QuestionsModel, PollModel, $stateParams, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let poll = this;
        poll.id = $stateParams.session_id;
        poll.session = {};
        poll.current_question_index = 0;

        Backand.on('poll_status_updated', function (data) {
            console.debug('poll status updated', data);
            poll.current_question_index = data[2];
        });

        Backand.on('poll_status_created', function (data) {
            console.debug('poll status created', data[2]);
            poll.current_question_index = data[2];
        });

        function fetch(id) {
            SessionsModel.fetch(id)
                .then( (result) => {
                    poll.session = result;
                    console.debug('s:', result);
                });

            QuestionsModel.all(id)
                .then( (result) => {
                    poll.question = result;
                    angular.forEach(result.data.data, (question) => {
                        poll.answer_array = angular.fromJson(question.answers);
                    });
                    console.debug('q:', poll);
                });

            PollModel.fetch(id)
                .then( (result) => {
                    poll.session = result;
                    console.debug('p:', result);
                });

        }

        function startOver(){
            console.debug('start over', poll.id);
            PollModel.fetch(poll.id)
                .then((result) => {
                    console.debug('lookup:', result);
                    let new_object = {poll_id: poll.id, poll_index: 0};
                    if(result.data.data.length == 0){ // does not exist, create                
                        console.debug('does not exist, create', new_object);
                        PollModel.create(new_object)
                            .then( (result) => {
                                // poll.session = result;
                                console.debug('created:', result);
                                poll.current_question_index = 0;
                            });
                    }else{
                        console.debug('exists, update', new_object);
                        PollModel.update(result.data.data[0].id, new_object)
                            .then( (result) => {
                                // poll.session = result;
                                console.debug('created:', result);
                                poll.current_question_index = 0;
                            });
                    }                        
            });
        }

        function nextQuestion(){
            console.debug('next question', poll.id);
            PollModel.fetch(poll.id)
                .then( (result) => {
                    console.debug('result', result);
                    let pollStatus = result.data.data[0];
                    console.debug('status:', pollStatus);
                    let poll_index = pollStatus.poll_index;
                    let questionCount = poll.question.data.data.length;
                    console.debug('question count: ', questionCount);
                    if (questionCount <= poll_index + 1){
                        console.debug('no more questions to show');
                    }else{
                        console.debug('still more questions');
                    }
                    let new_object = result.data.data[0];
                    new_object.poll_index = new_object.poll_index + 1;
                    PollModel.update(result.data.data[0].id, new_object)
                        .then( (result) => {
                            console.debug('update result:', result);   
                            poll.current_question_index = new_object.poll_index;                              
                    });                 
            });

            // PollModel.update(poll.id, { poll_id: poll.id, poll_index: "0"})
            //     .then( (result) => {
            //         console.debug('u:', result);
            //     });
        }

        function update(object) {
            console.debug('update: ', object);
            SessionsModel.update(object.id, object)
                .then( (result) => {
                    $ionicHistory.goBack();
                });
        }

        $scope.$on("$ionicView.enter", function () {
            poll.fetch(poll.id);
        });

        poll.fetch = fetch;
        poll.update = update;
        poll.startOver = startOver;
        poll.nextQuestion = nextQuestion;
    })

    .controller('EditQuestionCtrl', function (QuestionsModel, $stateParams, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let edit = this;
        edit.id = $stateParams.id;
        edit.session = {};
        edit.answer_array = [];
        function fetch(id) {
            QuestionsModel.fetch(id)
                .then( (result) => {
                    edit.question = result;
                    if(!angular.isUndefined(result.data.answers)){
                        edit.answer_array = angular.fromJson(result.data.answers);
                    }
                    console.debug('r:', result);
                });
        }

        function update(object) {
            object.answers = angular.toJson(edit.answer_array);
            console.debug('update: ', object);
            QuestionsModel.update(object.id, object)
                .then( (result) => {
                    $ionicHistory.goBack();
                });
        }

        function addAnswer(){
            console.debug('add answer');    
            edit.answer_array.push('');
        }

        $scope.$on("$ionicView.enter", function () {
            edit.fetch(edit.id);
        });

        edit.fetch = fetch;
        edit.update = update;
        edit.addAnswer = addAnswer;
    })

    .controller('SessionCtrl', function (SessionsModel, $rootScope, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let session = this;

        $scope.$on("$ionicView.enter", function () {
            getAll();
        });

        function updateSessions() {
            console.debug('updating session list');
            getData()
                .then( (result) => {
                    session.data = result.data.data;
                    console.debug('r:', result)
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function showQuestions(session_id){
            $state.go('app.questions', {session_id: session_id});
        }

        function showPoll(session_id){
            console.debug('show poll');
            $state.go('app.run_poll', {session_id: session_id});
        }

        function joinPoll(session_id){
            console.debug('join poll');
            $state.go('app.join_poll', {session_id: session_id});
        }

        function viewPoll(session_id){
            console.debug('view poll',session_id);
            $state.go('app.view_poll', {session_id: session_id});
        }

        function showAddSession(){
            $state.go('app.add_session');
        }

        Backand.on('sessions_updated', function (data) {
            console.debug('updated',data);
            getAll();
        });

        Backand.on('sessions_deleted', function (data) {
            console.debug('deleted',data);
            getAll();
        });

        Backand.on('sessions_created', function (data) {
            console.debug('created',data);
            getAll();
        });
   
        function getData(){
            // When we need to do actions after our get complete, we should return our promise, do do other actions on the data
            return SessionsModel.all();
        }

        function getAll() {
            SessionsModel.all()
                .then( (result) => {
                    session.data = result.data.data;
                });
        }

        function clearData(){
            session.data = null;
        }

        function create(object) {
            SessionsModel.create(object)
                .then( (result) => {
                    getAll();

                    let alertPopup = $ionicPopup.alert({
                        title: 'Session Created',
                        template: 'Name: ' + object.name
                    });

                    alertPopup.then((res) => {
                        $ionicHistory.goBack();
                    });
                });
        }

        function deleteObject(id) {
            SessionsModel.delete(id)
                .then( (result) => {
                    console.debug(result);
                    getAll();
                });
        }

        function initCreateForm() {
            session.newObject = {name: '', description: ''};
        }

        function editObject(object) {
            $state.go('app.edit_session',{id: object.id});
        }

        session.objects = [];
        session.getAll = getAll;
        session.create = create;
        session.delete = deleteObject;
        session.editObject = editObject;
        session.isAuthorized = false;
        session.updateSessions = updateSessions;
        session.showAddSession = showAddSession;
        session.showQuestions = showQuestions;
        session.showPoll = showPoll;
        session.viewPoll = viewPoll;

        $rootScope.$on('authorized', function () {
            session.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!session.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();
    })

    .controller('QuestionCtrl', function (QuestionsModel, $rootScope, Backand, $scope, $ionicHistory, $state, $ionicPopup, $stateParams) {
        let question = this;
        let session_id = $stateParams.session_id;

        $scope.$on("$ionicView.enter", function () {
            session_id = $stateParams.session_id;
            console.debug('session id: ', session_id);
            getAll(session_id);
            question.newObject = {question: '', session_id: session_id, answers: '', answer_array: []};
        });

        function updateQuestions() {
            console.debug('updating question list');
            getData()
                .then( (result) => {
                    angular.forEach(result.data.data, (question) => {
                        question.answer_array = angular.fromJson(question.answers);
                    });

                    question.data = result.data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function showAddQuestion(){
            console.debug('showAddQuestion');
            $state.go('app.add_question', {session_id: session_id});
        }

        Backand.on('questions_updated', function (data) {
            console.debug('questions_updated');
            getAll();
        });

        Backand.on('questions_deleted', function (data) {
            console.debug('questions_deleted');
            getAll();
        });

        Backand.on('questions_created', function (data) {
            console.debug('questions_created');
            getAll();
        });
   
        function getData(){
            return QuestionsModel.all(session_id);
        }

        function getAll() {
            QuestionsModel.all(session_id)
                .then( (result) => {
                    console.debug('got question data back: ', result);
                    question.data = result.data.data;
                    angular.forEach(question.data, (q) => {   
                        console.debug('response: ', q);                     
                        //q.answer_array = angular.fromJson(q.answers);
                        angular.forEach(result.data.data, (question) => {
                            q.answer_array = angular.fromJson(q.answers);
                        });
                        console.debug('q:', q);
                    });
                });
        }

        function clearData(){
            question.data = null;
        }

        function create(object) {
            console.debug('object:', object);
            object.answers = angular.toJson(object.answer_array);
            
            console.debug('create question: ', object);
            QuestionsModel.create(object)
                .then( (result) => {
                    getAll();
                    let alertPopup = $ionicPopup.alert({
                        title: 'Question Created',
                        template: 'Name: ' + object.question
                    });

                    alertPopup.then((res) => {
                        $ionicHistory.goBack();
                    });
                });
        }

        function deleteObject(id) {
            QuestionsModel.delete(id)
                .then( (result) => {
                    console.debug(result);
                    getAll();
                });
        }

        function editObject(object) {
            // todo this needs to pass session and question id's
            $state.go('app.edit_question',{id: object.id});
        }

        function buildAnswerArray(string){
            console.debug('calledo n: ', string);
            return angular.fromJson(string);
        }

        question.objects = [];
        question.getAll = getAll;
        question.create = create;
        question.delete = deleteObject;
        question.editObject = editObject;
        question.isAuthorized = false;
        question.updateQuestions = updateQuestions;
        question.showAddQuestion = showAddQuestion;
        question.buildAnswerArray = buildAnswerArray;

        $rootScope.$on('authorized', function () {
            question.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!question.isAuthorized){
            $rootScope.$broadcast('logout');
        }
    });

