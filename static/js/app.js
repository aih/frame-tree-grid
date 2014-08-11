var myApp = angular.module('myApp', ['ng','LocalForageModule', 'blueimp.fileupload', 'xeditable', 'ui.select2']);

myApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

var url = 'upload';
var testXML = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet href="\billres.xsl" type="text/xsl"?><!DOCTYPE amendment-doc PUBLIC "-//US Congress//DTDs/amend v2.8 20020720//EN" "http://xml.house.gov/amend.dtd"><amendment-doc amend-stage="proposed" amend-type="house-amendment" amend-degree="first"> </amendment-doc>';


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
   $scope.formBlob = new Blob([testXML], {type: 'text/xml'});
   $scope.getNames = function(fileList){return _.map(fileList, function(file){return file.name;});};

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
 $scope.select2Options = {
        allowClear:true
    }; 
  $scope.numbers =  [
      { value: '1', text: 'one' },
      { value: '2', text: 'two' },
      { value: '3', text: 'three' },
      { value: '4', text: 'four' },
      { value: '5', text: 'five' },
      { value: '6', text: 'six' },
      { value: '7', text: 'seven' },
      { value: '8', text: 'eight' },
      { value: '9', text: 'nine' },
      { value: '10', text: 'ten' }
    ];
   
    }
]);
