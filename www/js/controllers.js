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
                .then(handleLoginSuccess(login.email), function (error) {
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
                .then(function () {
                    let alertPopup = $ionicPopup.alert({
                        title: 'Logged out',
                        template: 'User: ' + login.user
                    });

                    alertPopup.then(function(res) {
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
                .then(function (result) {
                    edit.session = result;
                    console.debug('r:', result);
                });
        }

        function update(object) {
            console.debug('update: ', object);
            SessionsModel.update(object.id, object)
                .then(function (result) {
                    $ionicHistory.goBack();
                });
        }

        $scope.$on("$ionicView.enter", function () {
            edit.fetch(edit.id);
        });

        edit.fetch = fetch;
        edit.update = update;
    })

    .controller('EditQuestionCtrl', function (QuestionsModel, $stateParams, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let edit = this;
        edit.id = $stateParams.id;
        edit.session = {};

        function fetch(id) {
            QuestionsModel.fetch(id)
                .then(function (result) {
                    edit.question = result;
                    console.debug('r:', result);
                });
        }

        function update(object) {
            console.debug('update: ', object);
            QuestionsModel.update(object.id, object)
                .then(function (result) {
                    $ionicHistory.goBack();
                });
        }

        $scope.$on("$ionicView.enter", function () {
            edit.fetch(edit.id);
        });

        edit.fetch = fetch;
        edit.update = update;
    })

    .controller('SessionCtrl', function (SessionsModel, $rootScope, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        let session = this;

        $scope.$on("$ionicView.enter", function () {
            getAll();
        });

        function updateSessions() {
            console.debug('updating session list');
            getData()
                .then(function (result) {
                    session.data = result.data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function showQuestions(session_id){
            $state.go('app.questions', {session_id: session_id});
        }

        function showAddSession(){
            $state.go('app.add_session');
        }

        Backand.on('sessions_updated', function (data) {
            getAll();
        });

        Backand.on('sessions_deleted', function (data) {
            getAll();
        });

        Backand.on('sessions_created', function (data) {
            getAll();
        });
   
        function getData(){
            // When we need to do actions after our get complete, we should return our promise, do do other actions on the data
            return SessionsModel.all();
        }

        function getAll() {
            SessionsModel.all()
                .then(function (result) {
                    session.data = result.data.data;
                });
        }

        function clearData(){
            session.data = null;
        }

        function create(object) {
            SessionsModel.create(object)
                .then(function (result) {
                    getAll();

                    let alertPopup = $ionicPopup.alert({
                        title: 'Session Created',
                        template: 'Name: ' + object.name
                    });

                    alertPopup.then(function(res) {
                        $ionicHistory.goBack();
                    });
                });
        }

        function deleteObject(id) {
            SessionsModel.delete(id)
                .then(function (result) {
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
            question.newObject = {question: '', session_id: session_id};
        });

        function updateQuestions() {
            console.debug('updating question list');
            getData()
                .then(function (result) {
                    question.data = result.data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        function showAddQuestion(){
            console.debug('showAddQuestion');
            $state.go('app.add_question', {session_id: session_id});
        }

        Backand.on('questions_updated', function (data) {
            getAll();
        });

        Backand.on('questions_deleted', function (data) {
            getAll();
        });

        Backand.on('questions_created', function (data) {
            getAll();
        });
   
        function getData(){
            return QuestionsModel.all(session_id);
        }

        function getAll() {
            QuestionsModel.all(session_id)
                .then(function (result) {
                    console.debug('got question data back: ', result);
                    question.data = result.data.data;
                });
        }

        function clearData(){
            question.data = null;
        }

        function create(object) {
            QuestionsModel.create(object)
                .then(function (result) {
                    getAll();

                    let alertPopup = $ionicPopup.alert({
                        title: 'Question Created',
                        template: 'Name: ' + object.question
                    });

                    alertPopup.then(function(res) {
                        $ionicHistory.goBack();
                    });
                });
        }

        function deleteObject(id) {
            QuestionsModel.delete(id)
                .then(function (result) {
                    console.debug(result);
                    getAll();
                });
        }

        function editObject(object) {
            // todo this needs to pass session and question id's
            $state.go('app.edit_question',{id: object.id});
        }

        question.objects = [];
        question.getAll = getAll;
        question.create = create;
        question.delete = deleteObject;
        question.editObject = editObject;
        question.isAuthorized = false;
        question.updateQuestions = updateQuestions;
        question.showAddQuestion = showAddQuestion;

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

