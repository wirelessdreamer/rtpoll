'use strict';
describe("RTPoll", function() {
	var Backand, LoginService, LoginCtrl, scope;
	describe("LoginCtrl", function() {
		beforeEach(module("RTPoll.controllers"));

		beforeEach(inject(function (_LoginService_, $controller, $state, $rootScope) {
			scope = $rootScope.$new();

	    	LoginCtrl = $controller('LoginCtrl',{
	    		$scope: scope
	    	});
		}));

		it("sets the default user to Anonymous", function()  {
	  		console.debug(scope);
		    expect(scope.user).toBe(true);
		});
	});

  	
});