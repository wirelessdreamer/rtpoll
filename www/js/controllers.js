angular.module('SimpleRESTIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService, $ionicPopup, $ionicHistory) {
        var login = this;
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
                    var alertPopup = $ionicPopup.alert({
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
        var edit = this;
        edit.id = $stateParams.id;
        edit.session = {};

        function fetch(id) {
            SessionsModel.fetch(id)
                .then(function (result) {
                    edit.session = result;
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

    .controller('SessionCtrl', function (SessionsModel, $rootScope, Backand, $scope, $ionicHistory, $state, $ionicPopup) {
        var vm = this;

        $scope.$on("$ionicView.enter", function () {
            getAll();
        });

        function updateSessions() {
            console.debug('updating session list');
            getData()
                .then(function (result) {
                    vm.data = result.data.data;
                    $scope.$broadcast('scroll.refreshComplete');
                });;
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
        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }
   
        function getData(){
            // When we need to do actions after our get complete, we should return our promise, do do other actions on the data
            return SessionsModel.all();
        }

        function getAll() {
            SessionsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            SessionsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();

                    var alertPopup = $ionicPopup.alert({
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
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function editObject(object) {
            $state.go('app.edit_session',{id: object.id});
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.delete = deleteObject;
        vm.editObject = editObject;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;
        vm.updateSessions = updateSessions;
        vm.showAddSession = showAddSession;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    });

