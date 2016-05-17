'use strict';

angular.module('RTPoll', ['ionic', 'backand', 'RTPoll.controllers', 'RTPoll.services'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        BackandProvider.setAppName('rttest');
        BackandProvider.setSignUpToken('6a35bcb1-e7de-4950-9904-ae579e24f9e6');
        BackandProvider.setAnonymousToken('9818564a-4dbe-41d7-ba38-136a0064c97e');
        
        $stateProvider
            // setup an abstract state for the menu
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'LoginCtrl as login'
              })

            .state('app.manage', {
              url: '/manage',
              views: {
                'menuContent': {
                  templateUrl: 'templates/manage-poll.html',
                  controller: 'SessionCtrl as session'
                }
              }
            })

            .state('app.add_session', {
              url: '/add_session',
              views: {
                'menuContent': {
                  templateUrl: 'templates/add-poll.html',
                  controller: 'SessionCtrl as session'
                }
              }
            })

            .state('app.edit_session', {
              url: '/edit_session/:id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/edit-poll.html',
                  controller: 'EditCtrl as edit'
                }
              }
            })

            .state('app.questions', {
              url: '/questions/:session_id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/questions.html',
                  controller: 'QuestionCtrl as question'
                }
              }
            })

            .state('app.add_question', {
              url: '/add_question/:session_id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/add-question.html',
                  controller: 'QuestionCtrl as question'
                }
              }
            })

            .state('app.edit_question', {
              url: '/edit_question/:id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/edit-question.html',
                  controller: 'EditQuestionCtrl as edit'
                }
              }
            })

            .state('app.login', {
              url: '/login',
              views: {
                'menuContent': {
                  templateUrl: 'templates/login.html',
                  controller: 'LoginCtrl as login'
                }
              }
            })

            .state('app.poll', {
              url: '/poll',
              views: {
                'menuContent': {
                  templateUrl: 'templates/poll.html',
                  controller: 'SessionCtrl as session'
                }
              }
            })

            .state('app.run_poll', {
              url: '/poll/:session_id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/run-poll.html',
                  controller: 'PollCtrl as poll'
                }
              }
            })

            .state('app.join_poll', {
              url: '/join_poll',
              views: {
                'menuContent': {
                  templateUrl: 'templates/join-poll.html',
                  controller: 'SessionCtrl as session'
                }
              }
            })

            .state('app.view_poll', {
              url: '/view_poll/:session_id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/view-poll.html',
                  controller: 'PollCtrl as poll'
                }
              }
            })

            .state('app.about', {
              url: '/about',
              views: {
                'menuContent': {
                  templateUrl: 'templates/about.html',
                }
              }
            });

        $urlRouterProvider.otherwise('/app/manage');

        $httpProvider.interceptors.push('APIInterceptor');
        BackandProvider.runSocket(true);
    })

    .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('app.login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'app.login') {
                signout();
            }
            else if (toState.name != 'app.login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })

