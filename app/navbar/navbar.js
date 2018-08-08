'use strict';

angular.module('myApp.navbar', ['myApp.tasks'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/navbar', {
            templateUrl: 'navbar/navbar.html',
            controller: 'navbarController'
        });
    }])

    // .controller('NavbarCtrl', [function($scope) {
    //     $scope.tasks = ['Learn angularjs', 'Learn material'];
    // }])
    .component('toolbar', component())

    function component() {
        var component = {
            templateUrl: 'navbar/navbar.html',
            controller: navbarController,
            controllerAs: 'vm',
            transclude: true
        };

        return component;
    }
    navbarController.$inject = ['$rootScope']
    function navbarController($rootScope) {
        var vm = this;
        vm.tasks = ['Learn angularjs', 'Learn material'];
        vm.show = false;
        vm.showAdd = function() {
            // tasksController.show = !tasksController.show;
            vm.show = !vm.show;
            $rootScope.$broadcast('rootScope:broadcast', vm.show);
        };
        vm.showDone = function () {
            $rootScope.$broadcast('rootScope:filter', true);
        };
        vm.showUnDone = function () {
            $rootScope.$broadcast('rootScope:filter', false);
        };
        vm.showAll = function () {
            $rootScope.$broadcast('rootScope:filter', undefined);
        };
    };