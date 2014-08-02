var myApp = angular.module('myApp', ['ng','LocalForageModule', 'blueimp.fileupload', 'xeditable', 'siyfion.sfTypeahead']);

myApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

var url = 'test.com';

myApp.config(['$locationProvider', '$localForageProvider', '$httpProvider', 'fileUploadProvider', function ($locationProvider, $localForageProvider, $httpProvider, fileUploadProvider) {
    
    $locationProvider.html5Mode(true);

    $localForageProvider.config({
        name        : 'myApp', // name of the database and prefix for your data
        storeName   : 'storedParams', // name of the table
        description : 'some description'
    });

      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
    
}]);

myApp.controller('rootController', ['$scope', function ($scope) {
    $scope.words = {'first': 'this', 'second': 'that'};
}]);

myApp.controller('storeTextController', ['$scope', '$localForage', function ($scope, $localForage) {
    // Start fresh
    //$localForage.clearAll();
    $scope.store = function(data) {
        $localForage.setItem('storedText', data).then(function(data) {
            $scope.inputText = '';
            $scope.storedText = data;
            alertify.log('storedText: '+ data);
        });
    };
    
    // init value
    $localForage.getItem('storedText').then(function(data) {
        $scope.storedText = data;
    });
    $localForage.keys().then(function(data) {
        console.log('list of keys', data);
    });
}]);

myApp.controller('DemoFileUploadController', [ '$scope', '$http', '$filter', '$window', function ($scope, $http) {
    $scope.options = {
        url: url
    };
    $scope.loadingFiles = true;
    $http.get(url)
    .then(function (response) {
                                $scope.loadingFiles = false;
                                $scope.queue = response.data.files || [];
                            },
                            function () {
                                $scope.loadingFiles = false;
                            });
}]);

myApp.controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

myApp.controller('typeaheadDemoController', ['$scope', function($scope){
    $scope.selectedNumber = null;
  
  // instantiate the bloodhound suggestion engine
  var numbers = new Bloodhound({
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.num); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: [
      { num: 'one' },
      { num: 'two' },
      { num: 'three' },
      { num: 'four' },
      { num: 'five' },
      { num: 'six' },
      { num: 'seven' },
      { num: 'eight' },
      { num: 'nine' },
      { num: 'ten' }
    ]
  });
   
  // initialize the bloodhound suggestion engine
  numbers.initialize();
  
  $scope.numbersDataset = {
    displayKey: 'num',
    source: numbers.ttAdapter()
  };
  
  $scope.addValue = function () {
    numbers.add({
      num: 'twenty'
    });
  };
  
  $scope.setValue = function () {
    $scope.selectedNumber = { num: 'seven' };
  };
  
  $scope.clearValue = function () {
    $scope.selectedNumber = null;
  };

  
  // Typeahead options object
  $scope.exampleOptions = {
    highlight: true
  };
  
  $scope.exampleOptionsNonEditable = {
    highlight: true,
    editable: false // the new feature
  }; 
  
    }
]);
