'use strict';

angular.module('RTPoll.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('PollModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'poll_status/';

        function getUrlForId(id) {
            return getUrl() + id;
        }

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        service.fetch = function (id) {
           return $http ({
              method: 'GET',
              url: getUrl(),
              params: {
                pageSize: 20,
                pageNumber: 1,
                filter: [
                  {
                    fieldName: 'poll_id',
                    operator: 'equals',
                    value: id
                  }
                ],
                sort: ''
              }
            });
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            var result = service.fetch(id);
            console.debug('delete based off of ', result);
            //return $http.delete(getUrlForId(id));
        };
    })

    .service('QuestionsModel', function ($http, Backand, uuidService) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'questions/';

        function getUrlForId(id) {
            return getUrl() + id;
        }

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        service.all = function (session_id) {
            return $http ({
              method: 'GET',
              url: getUrl(),
              params: {
                pageSize: 20,
                pageNumber: 1,
                filter: [
                  {
                    fieldName: 'session_id',
                    operator: 'equals',
                    value: session_id
                  }
                ],
                sort: '',
                deep: true
              }
            });
            //return $http.get(getUrl());
        };

        service.fetch = function (id) {
            console.debug('calling fetch');
            var object = $http.get(getUrlForId(id));
            console.debug('O:', object);
            return object;
        };

        service.create = function (object) {
            object.question_id = uuidService.generateUUID();
            console.debug('create:', object);
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })

    .service('AnswersModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'answers/';

        function getUrlForId(id) {
            return getUrl() + id;
        }

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        service.all = function (session_id) {
            return $http ({
              method: 'GET',
              url: getUrl(),
              params: {
                pageSize: 20000,
                pageNumber: 1,
                filter: [
                  {
                    fieldName: 'session_id',
                    operator: 'equals',
                    value: session_id
                  }
                ],
                sort: '',
              }
            });
        };

        service.fetch = function (id) {
            console.debug('calling fetch');
            var object = $http.get(getUrlForId(id));
            console.debug('O:', object);
            return object;
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })

    .service('SessionsModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'sessions/';

        function getUrlForId(id) {
            return getUrl() + id;
        }

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        service.all = function () {
            return $http ({
              method: 'GET',
              url: getUrl(),
              params: {
                pageSize: 20,
                pageNumber: 1,
                sort: '',
                deep: true
              }
            });
        };

        service.fetch = function (id) {
            console.debug('calling fetch');
            var object = $http.get(getUrlForId(id));
            console.debug('O:', object);
            return object;
        };

        service.create = function (object) {
            return $http.post(getUrl(), object);
        };

        service.update = function (id, object) {
            console.debug('saw update: ', object)
            return $http.put(getUrlForId(id), object);
        };

        service.delete = function (id) {
            return $http.delete(getUrlForId(id));
        };
    })

    .service('LoginService', function (Backand) {
        var service = this;

        service.signin = function (email, password) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin = function(){
            // don't have to do anything here,
            // because we set app token at app.js
        }

        service.signout = function () {
            return Backand.signout();
        };
    })

    .service('uuidService', function(){
        var service = this;
        service.generateUUID = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
    });
