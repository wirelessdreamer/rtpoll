'use strict';

angular.module('RTPoll.services', [])

    .service('APIInterceptor', function ($rootScope, $q) {
        let service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

    .service('PollModel', function ($http, Backand) {
        let service = this,
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
            let result = service.fetch(id);
            console.debug('delete based off of ', result);
            //return $http.delete(getUrlForId(id));
        };
    })

    .service('QuestionsModel', function ($http, Backand) {
        let service = this,
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
            let object = $http.get(getUrlForId(id));
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
        let service = this,
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
            let object = $http.get(getUrlForId(id));
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
        let service = this;

        service.signin = function (email, password, appName) {
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
    });
