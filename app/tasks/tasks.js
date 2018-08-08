'use strict';
angular.module('myApp.tasks', [])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/todo', {
            templateUrl: 'tasks/tasks.html',
            controller: 'tasksController'
        });
    }])

    .controller('tasksController', ['$scope', '$rootScope', '$mdDialog', '$http', function($scope, $rootScope, $mdDialog, $http) {
        var vm = this;
        vm.show = false;
        $scope.newTaskValue = '';
        $scope.maxPage = true;
        $http.get("/tasks")
            .then(function success (response) {
                $scope.allAllTasks = response.data;
                $scope.allTasks = $scope.allAllTasks;
                $scope.scrollPageBtns = function(pageId) {
                    let pageBtnArr = createPagesBtn($scope.allTasks.length, pageId);
                    $scope.pageButtons = pageBtnArr[0];
                    $scope.maxPage = pageBtnArr[1];
                }
                $rootScope.$on('rootScope:filter', function (event, data) {
                    if(data === undefined) {
                        $scope.tasksArr = cutArr(undefined, $scope.allAllTasks);
                        return;
                    }
                    $scope.allTasks = $scope.allAllTasks.filter( function (item) {
                        return item.status === data;
                    });
                    $scope.tasksArr = cutArr(undefined, $scope.allTasks);
                });
                $scope.delete = function(id) {
                    $http.delete(`/tasks/${id}`);
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
                    $http.post("/tasks", JSON.stringify({id: $scope.allAllTasks.length + 1, task: newTask, status: false}))
                        .then(function success (response) {
                            $scope.response=response.data;

                        });
                    $scope.newTaskValue = null;
                };
                $scope.cutArray = function(pageId, allTasks) {
                    $scope.tasksArr = cutArr(pageId, allTasks);
                    let pageBtnsArr = createPagesBtn(allTasks.length, pageId);
                    $scope.pageButtons = pageBtnsArr[0];
                    $scope.maxPage = pageBtnsArr[1];
                }

                $scope.statusChange = function (task) {
                    $http.put(`/tasks/:${task.id}`, JSON.stringify({_id: task._id, task: task.task, status: !task.status}));
                }

                $scope.showEdit = function(ev, id) {
                    var confirm = $mdDialog.prompt()
                        .title('Edit your task')
                        // .textContent('Bowser is a common name.')
                        .placeholder('Task')
                        .ariaLabel('Task')
                        .initialValue('')
                        .targetEvent(ev)
                        .required(true)
                        .ok('OK!')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function(result) {
                        $scope.tasksArr.forEach(function (elem, index) {
                            if(elem.id === id) {
                                $scope.tasksArr[index].task = result;
                                $scope.statusChange($scope.tasksArr[index]);
                            }
                        });
                    });
                };
            });
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
        let amountPages = Math.ceil(length / 5);
        if(pageId === amountPages - 2 || amountPages < 3) {state = false;}
        for(let i = pageId - 1; i <= pageId + 1; i++) {
            if(i === amountPages && amountPages === 2) {
                break;
            }
            if(i === amountPages) {
                pageButtons.unshift({id: i - 2, text: `${i - 2}`});
                state = false;
                break;
            }
            pageButtons.push({id: i, text: `${i+1}`});
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