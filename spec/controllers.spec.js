'use strict';
describe("RTPoll", function() {
	var Backand, LoginService, LoginCtrl;
	describe("LoginCtrl", function() {
		beforeEach(module("RTPoll.controllers"));

		beforeEach(inject(function (_LoginService_, $state) {
	    	LoginCtrl = $controller('LoginCtrl');
		}));
	});

  	it("sets the default user to Anonymous", function()  {
  		console.debug(LoginCtrl);
	    expect(LoginCtrl.user).toBe(true);
	});
});