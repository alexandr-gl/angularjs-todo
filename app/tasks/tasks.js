'use strict';
angular.module('myApp.tasks', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/todo', {
            templateUrl: 'tasks/tasks.html',
            controller: 'tasksController'
        });
    }])

    .controller('tasksController', ['$scope', '$rootScope', '$mdDialog', function($scope, $rootScope, $mdDialog) {
        var vm = this;
        vm.show = false;
        $scope.newTaskValue = '';
        $scope.maxPage = true;
        $scope.allAllTasks = [
            {id: 0, task: 'Learn angularjs', status: true},
            {id: 1, task: 'Learn ReactJS', status: false},
            {id: 2, task: 'Learn VueJS', status: false},
            {id: 3, task: 'Learn angular2+', status: true},
            {id: 4, task: 'Learn angular2+', status: true},
            {id: 5, task: 'Learn angular2+', status: false},
            {id: 6, task: 'Learn angular2+', status: true},
            {id: 7, task: 'Learn angular2+', status: true},
            {id: 8, task: 'Learn angular2+', status: false},
            {id: 9, task: 'Learn angular2+', status: true},
            {id: 10, task: 'Learn angular2+', status: true},
            {id: 11, task: 'Learn angular2+', status: false},
            {id: 12, task: 'Learn angular2+', status: true},
            {id: 13, task: 'Learn angular2+', status: true},
            {id: 14, task: 'Learn angular2+', status: false},
            {id: 15, task: 'Learn angular2+', status: true},
            {id: 16, task: 'Learn angular2+', status: true},
            {id: 17, task: 'Learn angular2+', status: false},
            {id: 18, task: 'Learn angular2+', status: true},
            {id: 19, task: 'Learn angular2+', status: true},
            {id: 20, task: 'Learn angular2+', status: false},
            {id: 21, task: 'Learn angular2+', status: true},
            {id: 22, task: 'Learn angular2+', status: true},
            {id: 23, task: 'Learn angular2+', status: false},
            {id: 24, task: 'Learn angular2+', status: true},
            {id: 24, task: 'Learn angular2+', status: false}
        ];
        $scope.allTasks = $scope.allAllTasks;
        $scope.scrollPageBtns = function(pageId) {
            let pageBtnArr = createPagesBtn($scope.allTasks.length, pageId);
            $scope.pageButtons = pageBtnArr[0];
            $scope.maxPage = pageBtnArr[1];
        }
        $rootScope.$on('rootScope:filter', function (event, data) {
            if(data === undefined) {$scope.tasksArr = $scope.allAllTasks; return;}
            $scope.allTasks = $scope.allAllTasks.filter( function (item) {
                return item.status === data;
            });
            $scope.tasksArr = cutArr(undefined, $scope.allTasks);
        });
        $scope.delete = function(id) {
            let idOfDel;
            $scope.tasksArr.forEach(function (elem, index) {
                if(elem.id === id) {
                    $scope.tasksArr.splice(index, 1);
                }
            });
        }
        $scope.tasksArr = cutArr(undefined, $scope.allTasks);
        $scope.pageButtons = createPagesBtn($scope.allTasks.length, 1)[0];
        $scope.maxPage = createPagesBtn($scope.allTasks.length, 1)[1];
        $rootScope.$on('rootScope:broadcast', function (event, data) {
            vm.show = data;
        });
        $scope.addCtrl = function(newTask) {
            let arrays = add(newTask, $scope.allTasks);
            $scope.allTasks = arrays[0];
            $scope.tasksArr = arrays[1];
            if($scope.allTasks.length % 5 === 1) {
                let pageBtnArr = createPagesBtn($scope.allTasks.length, Math.floor($scope.allTasks.length / 5)-1);
                $scope.pageButtons = pageBtnArr[0];
                $scope.maxPage = pageBtnArr[1];
            }
        };
        $scope.cutArray = function(pageId, allTasks) {
            $scope.tasksArr = cutArr(pageId, allTasks);
            let pageBtnsArr = createPagesBtn(allTasks.length, pageId);
            $scope.pageButtons = pageBtnsArr[0];
            $scope.maxPage = pageBtnsArr[1];
        }

        $scope.showEdit = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            console.log('EVENT', ev);
            var confirm = $mdDialog.prompt()
                .title('What would you name your dog?')
                .textContent('Bowser is a common name.')
                .placeholder('Dog name')
                .ariaLabel('Dog name')
                .initialValue('Buddy')
                .targetEvent(ev)
                .required(true)
                .ok('Okay!')
                .cancel('I\'m a cat person');

            $mdDialog.show(confirm).then(function(result) {
                $scope.tasksArr.forEach(function (elem, index) {
                    if(elem.id === id) {
                        $scope.tasksArr[index].task = result;
                    }
                });
            });
        };

    }]);

    function cutArr(pageId, allTasks) {
        let tasksArr;
        if(pageId === undefined && allTasks !== undefined)
        {
            tasksArr = allTasks.slice(0, 5);
        }
        else if(allTasks !== undefined) {
            tasksArr = allTasks.slice(pageId * 5, pageId * 5 + 5);
        }
        return tasksArr;
    }

    function createPagesBtn(length, pageId) {
        let pageButtons = [];
        pageButtons.length = 0;
        let state = true;
        if(pageId === 0) {pageId = 1;}
        if(length % 5 === 0)
        {
            let amountPages = length / 5;
            for(let i = pageId - 1; i <= pageId + 1; i++) {
                if(i > amountPages - 1) {state = false; break;}
                if(i === amountPages - 1) {state = false;}
                pageButtons.push({id: i, text: `${i+1}`});
            }
        }
        else {
            let amountPages = Math.ceil(length / 5);
            for(let i = pageId - 1; i <= pageId + 1; i++) {
                if(i > amountPages - 1) {state = false; break;}
                if(i === amountPages - 1) {state = false;}
                pageButtons.push({id: i, text: `${i+1}`});
            }
        }
        return [pageButtons, state];
    }

    function add(value, allTasks) {
        let tasksArr;
        allTasks.push({id: allTasks.length + 1, task: value, status: false});
        if(allTasks.length % 5 !== 0) {
            tasksArr = cutArr(Math.floor(allTasks.length / 5), allTasks);
        }
        else if(allTasks.length % 5 === 0) {
            tasksArr = cutArr(Math.floor(allTasks.length / 5) - 1, allTasks);
        }
        return [allTasks, tasksArr];
    }