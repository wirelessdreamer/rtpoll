// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SimpleRESTIonic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services'])

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
            .state('app.search', {
                url: '/search',
                views: {
                  'menuContent': {
                    templateUrl: 'templates/search.html'
                  }
                }
              })

            .state('app.sessions', {
              url: '/sessions',
              views: {
                'menuContent': {
                  templateUrl: 'templates/sessions.html',
                  controller: 'SessionCtrl as vm'
                }
              }
            })

            .state('app.add_session', {
              url: '/add_session',
              views: {
                'menuContent': {
                  templateUrl: 'templates/add-session.html',
                  controller: 'SessionCtrl as vm'
                }
              }
            })

            .state('app.edit_session', {
              url: '/edit_session/:id',
              views: {
                'menuContent': {
                  templateUrl: 'templates/edit-session.html',
                  controller: 'EditCtrl as edit'
                }
              }
            })

            // .state('app.session', {
            //   url: '/session/:id',
            //   views: {
            //     'menuContent': {
            //       templateUrl: 'templates/questions.html',
            //       controller: 'SessionCtrl as vm'
            //     }
            //   }
            // })

            .state('app.login', {
              url: '/login',
              views: {
                'menuContent': {
                  templateUrl: 'templates/login.html',
                  controller: 'LoginCtrl as login'
                }
              }
            });

        $urlRouterProvider.otherwise('/app/sessions');

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

