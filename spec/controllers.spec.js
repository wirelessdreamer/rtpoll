'use strict';
describe("RTPoll", function() {
	var Backand, LoginService, controller, scope, $q, $rootScope, ionicPopup, state;
	describe("LoginCtrl", function() {
		beforeEach(module("RTPoll.controllers"));

		beforeEach(inject(function ($controller, _$rootScope_, $log, _$q_) {
			$q = _$q_;
			$rootScope = _$rootScope_;
			Backand = {};
			LoginService = {
				signin: function(){},
				signout: function(){},
				anonymousLogin: function(){}
			};
			ionicPopup = {
				alert: function(){}
			};
			var ionicHistory = {
				nextViewOptions: function(){}
			};
			state = {
				go: function(){}
			};

			scope = $rootScope.$new();

	    	controller = $controller('LoginCtrl', {
	    		'Backand': Backand,
	    		'$state': state,
	    		'$rootScope': $rootScope,
	    		'LoginService': LoginService,
	    		'$ionicPopup': ionicPopup,
	    		'$ionicHistory': ionicHistory,
	    		'$log': $log
	    	});
	    	
		}));

		it("sets the default user to Anonymous", function()  {
		    expect(controller.user).toBe('Anonymous');
		});

		describe("signin", function(){
			it("calls LoginService.signin when called", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});
				controller.email = 'email_name';
				controller.password = 'my_pass';
				controller.signin();
				expect(LoginService.signin).toHaveBeenCalledWith(controller.email, controller.password);
			});

			it("sets user to '' when call to LoginService.signin fails", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.reject();
		    		return deferred.promise;
		    	});
				controller.user = 'filler';
				controller.email = 'email_name';
				controller.password = 'my_pass';
				controller.signin();
				$rootScope.$apply();
				expect(controller.user).toBe('');
			});

			it("calls $broadcast with authorized parameter when called", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});
				spyOn($rootScope, '$broadcast');
				controller.email = 'email_name';
				controller.password = 'my_pass';
				controller.signin();
				expect($rootScope.$broadcast).toHaveBeenCalledWith('authorized');
			});

			it("calls state.go with app.manage", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});
				spyOn(state,'go');
				controller.email = 'email_name';
				controller.password = 'my_pass';
				controller.signin();
				expect(state.go).toHaveBeenCalledWith('app.manage');
			});

			it("updates user to email address on successful login", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});
				controller.user = 'filler';
				controller.email = 'email_name';
				controller.password = 'my_pass';
				controller.signin();
				$rootScope.$apply();
				expect(controller.user).toBe(controller.email);
			});
		});

		describe("signout", function(){
			it('displays a user alert on successful logout', function(){
				spyOn(LoginService,'signout').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});

		    	spyOn($rootScope, '$broadcast');

		    	spyOn(ionicPopup, 'alert').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});

		    	controller.signout();
		    	$rootScope.$apply();
		    	expect(controller.user).toBe('Anonymous');
                expect($rootScope.$broadcast).toHaveBeenCalledWith('logout');
			});
		});

		describe("anonymousLogin", function(){
			it("calls $broadcast with authorized parameter when called", function(){
				spyOn(LoginService,'signin').and.callFake(function(){
		    		var deferred = $q.defer();
		    		deferred.resolve();
		    		return deferred.promise;
		    	});
				spyOn($rootScope, '$broadcast');
				controller.anonymousLogin();
				expect(controller.user).toBe('Anonymous');
				expect($rootScope.$broadcast).toHaveBeenCalledWith('authorized');
			});
		});

		describe("showLogin", function(){
			it("calls app.login with app.login", function(){
				spyOn(state,'go');
				controller.showLogin();
				expect(state.go).toHaveBeenCalledWith('app.login');
			});
		});
	});

  	
});