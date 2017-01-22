angular.module('kanplan.controllers', [])

// Logging control //UserSession?
.controller('LoginCtrl', function($scope, $http, $state, $stateParams, $ionicSideMenuDelegate, UserID){
  $scope.email = "";
  $scope.password = "";

  $scope.error = "";

  //disable side menu on login page
  $ionicSideMenuDelegate.canDragContent(false);
  //enable side menu drag before moving to next view
  $scope.$on('$ionicView.beforeLeave', function(event) {
    $ionicSideMenuDelegate.canDragContent(true);
  });

  $scope.login = function(email,password, userId){
    var user = {
      email: email,
      password:password,
      userId: userId
    };
    _httpPostLogin(user)
  };

  function _httpPostLogin(user){
    var request = {
      method : "POST",
      url : "http://52.14.22.20:3000/user/login",
      headers : {
        'content-type' : 'application/json'
      },
      data : {
        email : user.email,
        password : user.password,
        userId: user.userId // use user idea in a session variable for later requests
      }
    };

    $http(request).then(
        function(successCallback, errorCallback){

            if(successCallback.status === 200){
                //store the UserID on login
                UserID.set(user.userId);
                $state.go('dashboard');
            }

            // TODO impliment some error handling
           //console.log(res);
            /*if(err){
                // figure out best way to error handle
                $scope.error = $stateParams.error;
                $state.go('login', {error:true});
                console.log("this is err: " + err);
            } else {
                $state.go('dashboard');
            } */

        }, function(errorCallback) {
            $scope.error = $stateParams.error;
            $state.go('login', {error:true});
            console.log('test ' + errorCallback);
        }
    );
      /*function(res){
        if(res.status === 200){
          UserSession.set("user",res.data);
          UserSession.set("active", true);
          $state.go('chat');
        }
        console.dir(res)
      },
       function(res){
         $state.go('error');
    }); */
  }
})

.controller('SignUpCtrl', function($scope, $http, $state){
  $scope.user = {
    name: "",
    email: "",
    password: ""
  };

  $scope.signUp = function(name,email,password){
    $scope.user.name = name;
    $scope.user.email = email;
    $scope.user.password = password;
    _httpPostSignUp();
  };

 function _httpPostSignUp(){
   var request = {
     method : "POST",
     url: "http://52.14.22.20:3000/user/signup",
     headers : {
       'content-type' : 'application/json'
     },
     data : {
       name : $scope.user.name,
       email : $scope.user.email,
       password : $scope.user.password,
     }
   };

   $http(request).then(
       function(res ){
           if(res.status === 200){
               // if request is returned from server, then go to dashboard
               console.log("Post to user/signup");
                $state.go('dashboard');
           }


       }
   );
     /*function(res){
       console.log('Success');
       console.dir(res);
     },
      function(res){
        $state.go('error');
   }); */
  }
 })

.controller('DashboardCtrl', function($scope, $ionicPopup, $state, $stateParams, $ionicSideMenuDelegate, Tasks){
    //Enable side menu
   $ionicSideMenuDelegate.canDragContent(true);
   $scope.toggleLeft = function() {
     $ionicSideMenuDelegate.toggleLeft();
   };

   // get the tasks from the backend based on the :orgId
   //$stateProvider.state('org.task',{
    // url: '/dashboard/:orgId',
     
  // });

 })

// -----------------------------------

.controller('ErrorCtrl', function($scope, $ionicPopup, $state){
    var alertPopup = $ionicPopup.show({
       title: 'You Messed Up',
       buttons: [
         {
           text: 'Continue',
           type: 'button-assertive',
           onTap: function(e){
             $state.go('login');
           }
         }
       ]
     });
})// Task template factory

.directive('task', function() {
  return { // custom DOM element for tast
    templateUrl: 'templates/task.html'
  };
})

 // New Task template controller
.controller('NewTaskCtrl', function($scope, $ionicModal, UserID){
    //
    $scope.task = {
        title: "",
        description: "",
        compensation: "",
        asignee : []
    };



  $scope.createTask = function(title, description, compensation, asignee ){
    $scope.task.title = title;
    $scope.task.description = description;
    $scope.task.compensation = compensation;
    $scope.task.asignee = asignee;
    _httpPostTask(task);
  }


$ionicModal.fromTemplateUrl('templates/new.task.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.createTask = function(title, description, compensation, asignee){

    var task = {
      title: title,
      description: description,
      compensation: compensation,
      author: user.userId,
      asignee: asignee
    }

    _httpPostTask(task);
    console.log("create task");
    $scope.modal.hide();
  }

  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });


function _httpPostTask(task, orgId){
    var request = {
        method : "POST",
        url: "http://52.14.22.20:3000/tasks/" + orgId,
        headers : {
            'content-type' : 'application/json'
            },
        data : {
            title: $scope.task.title,
            description: $scope.task.description,
            compensation: $scope.task.compensation,
            asignee: $scope.task.asignee,
            userId: $scope.task.author
        }
    };

        $http(request).then(
            function(res ){
                if(res.status === 200){
                    // if request is returned from server, then go to dashboard
                    console.log("Post to user/signup");
                       // $state.go('dashboard');
                       //close modal
                }
            }
        );
    }
});


