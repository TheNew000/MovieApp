var app = angular.module('commerceApp', ['ngRoute', 'ngCookies']);

app.controller('mainController', function ($scope, $http, $location, $cookies) {
    var apiPath = "http://dannyarango.com:3000";

    // Register Function
    $scope.register= function(){
        if($scope.password != $scope.password2){
            alert('Your passwords do not match!');
        }else{
            $http.post(apiPath + '/register', {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            }).then(function success(response){
                if(response.data.message == 'Added: ' + $scope.username){
                    $cookies.put('token', response.data.token);
                    $cookies.put('username', $scope.username);
                    $location.path('/options');
                }
            }, function error(response){
                console.log(response.data.message);
            });
        }
    }

    // Log In Function
    $scope.login= function(){
        $http.post(apiPath + '/login', {
            username: $scope.username,
            password: $scope.password
        }).then(function success(response){
            if(response.data.success){
                $location.path('/options');
            }else{
                alert('Please Check Your UserName and Password.  No matches found with the information provided.');
            }
        }, function error(response){
            console.log(response.data.message);
        });
    }

    $http.get(apiPath + '/getUserData?token=' + $cookies.get('token')
    ).then(function success(response){
        if(response.data.failure == 'badToken'){
            $location.path = '/login';
        }else if(response.data.failure == 'noToken'){
            $location.path = '/login';
        }else{
            $location.path = '/options';
        }
    }, function error(respone){

    });

    // Logout Function
    // $cookies.put('token', '') || $cookies.remove('token')

    // Options Controller

    $scope.optionsForm = function(formId){
        var frequency = $scope.frequency;
        var quantity = $scope.quantity;
        var grind = $scope.grindTypeThree;
    $http.post(apiUrl + 'options', {
            frequency: frequency,
            quantity: quantity,
            grind: grind,
            token: $cookies.get('token')
        }).then(function successCallback(response){
            if(response.data.success == 'updated'){
                $location.path('/delivery');
            };
        }, function errorCallback(response){
        });
    };
        $scope.frequencies = [
            'Weekly',
            'Bi-weekly',
            'Monthly'
        ];

        $scope.grinds = [
            {option: 'Extra coarse'},
            {option: 'Coarse'},
            {option: 'Medium-coarse'},
            {option: 'Medium'},
            {option: 'Medium-fine'},
            {option: 'Fine'},
            {option: 'Extra fine'}
        ];

    if(($location.path() != '/') && ($location.path() != '/register') && ($location.path() != '/login') && ($location.path() != '/about')){

        $http.get(apiUrl+'getUserData?token='+$cookies.get('token'),{
        }).then(function successCallback(response){
            if(response.data.failure == 'badToken'){
                console.log('badToken')
                $location.path('/');
            }else{  
            $scope.grind = response.data.grind;
            $scope.frequency = response.data.frequency;
            $scope.quantity = response.data.quantity;
            $scope.name = response.data.name;
            $scope.address = response.data.address;
            $scope.address2 = response.data.address2;
            $scope.city = response.data.city;
            $scope.state = response.data.state;
            $scope.zipCode = response.data.zipCode;
            $scope.deliveryDate = response.data.deliveryDate;
            $scope.total = Number(response.data.quantity) * 20;
            enableStripe($scope.total);
            }
        }, function errorCallback(response){
        });
    }

    // Delivery Controller
    $scope.deliveryDate = new Date();
    $scope.deliveryForm = function(){

        var date = new Date($scope.deliveryDate);
        var formattedDate = ((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());

        $http.post(apiUrl + 'delivery', {
            name: $scope.name,
            address: $scope.address,
            address2: $scope.address2,
            city: $scope.city,
            state: $scope.state,
            zipCode: $scope.zipCode,
            deliveryDate: formattedDate,
            token: $cookies.get('token')
        }).then(function successCallback(response){
            $location.path('/payment');
        }, function errorCallback(response){
        });
    };

    $scope.addtoCart = function(idofThingClickedOn){
        var oldCart = $cookies.get('cart');
        var newCart = oldCart + ',' + idofThingClickedOn;
        $cookies.put('cart', newCart);
    }

    $scope.getCart = function(){
        var cart = $cookies.get('cart');
        var cartItemsArray = cart.split(',');
        for (var i = 0; i < cartItemsArray.length; i++) {
            cartItemsArray[i] // get the properties of each item
        }
    }

    var testSK = sk_test_bWG4PAoIYg2YjabReOAUcyya;
    var testPK = pk_test_h3HbD6hpWsvYsqfaFtI0SKkP;
    var liveSK = sk_live_uvtD7Mc45hb04aDeNR8tVMpX;
    var livePK = pk_live_iNi4Ji9yC7drV0DgyB1QDFRb;

    $scope.payOrder = function(userOptions) {
        $scope.errorMessage = "";
        var handler = StripeCheckout.configure({
            key: 'pk_test_h3HbD6hpWsvYsqfaFtI0SKkP',
            image: 'assets/img/dc_roasters_200x124_lt.png',
            locale: 'auto',
            token: function(token) {
                console.log("The token Id is: ");
                console.log(token.id);

                $http.post(apiUrl + 'stripe', {
                    amount: $scope.total * 100,
                    stripeToken: token.id,
                    token: $cookies.get('token')
                        //This will pass amount, stripeToken, and token to /payment
                }).then(function successCallback(response) {
                    console.log(response.data);
                    if (response.data.success) {
                        //Say thank you
                        $location.path('/receipt');
                    } else {
                        $scope.errorMessage = response.data.message;
                        //same on the checkout page
                    }
                }, function errorCallback(response) {});
            }
        });
        handler.open({
            name: 'DC Roasters',
            description: 'A Better Way To Grind',
            amount: $scope.total * 100
        });
    };

});

// Set up routes using the routes module
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'mainController'
    }).when('/login',{
        templateUrl: 'views/login.html',
        controller: 'mainController'
    }).when('/register',{
        templateUrl: 'views/register.html',
        controller: 'mainController'
    }).when('/options',{
        templateUrl: 'views/options.html',
        controller: 'mainController'
    }).when('/delivery',{
        templateUrl: 'views/delivery.html',
        controller: 'mainController'
    }).when('/payment',{
        templateUrl: 'views/payment.html',
        controller: 'mainController'
    }).otherwise({
        redirectTo: '/'
    });
});
