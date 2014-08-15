(function(){
    var ftg = angular.module('ftg', ['ng','LocalForageModule', 'blueimp.fileupload', 'xeditable', 'ui.select2','ngtreeRepeat' ]);

ftg.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

var url = 'upload';
var testXML = '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet href="\billres.xsl" type="text/xsl"?><!DOCTYPE amendment-doc PUBLIC "-//US Congress//DTDs/amend v2.8 20020720//EN" "http://xml.house.gov/amend.dtd"><amendment-doc amend-stage="proposed" amend-type="house-amendment" amend-degree="first"> </amendment-doc>';


ftg.config(['$locationProvider', '$localForageProvider', '$httpProvider', 'fileUploadProvider', function ($locationProvider, $localForageProvider, $httpProvider, fileUploadProvider) {
    
    $locationProvider.html5Mode(true);

    $localForageProvider.config({
        name        : 'ftg', // name of the database and prefix for your data
        storeName   : 'storedParams', // name of the table
        description : 'some description'
    });

      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
    
}]);

ftg.controller('rootController', ['$scope', function ($scope) {
    $scope.branches = [{'name':'rootNode', 'leaves':[{'name':'childNode1'}, {'name': 'childNode2'}, {'name': 'childNode3'}]},{'name':'rootNode2', 'leaves':[{'name':'otherChild1'}, {'name':'otherChild2'}, {'name':'otherChild3'}]}
    ];

}]);

ftg.controller('storeTextController', ['$scope', '$localForage', function ($scope, $localForage) {
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

ftg.controller('DemoFileUploadController', [ '$scope', '$http', '$filter', '$window', function ($scope, $http) {
    $scope.options = {
        url: url
    };
    $scope.loadingFiles = true;
   $scope.formBlob = new Blob([testXML], {type: 'text/xml'});
   $scope.getNames = function(fileList){return _.map(fileList, function(file){return file.name;});};

}]);

ftg.controller('FileDestroyController', [
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

ftg.controller('typeaheadDemoController', ['$scope', function($scope){
 $scope.select2Options = {
        allowClear:true
    }; 
 $scope.$watch(function(){if($scope.select2){return $scope.select2;}}, function(){
     if($scope.queue.length>0){
     $scope.store($scope.queue[$scope.select2].name);
     }
 });
   
    }
]);

/*====================
 * Non-Angular scripts
 */

$(function () { $('#jstree_ng_demo').jstree({
"core" : {
    "animation" : 0,
    "check_callback" : true,
    "themes" : { "stripes" : true }
  },
  "types" : {
    "#" : {
      "max_children" : 1, 
      "max_depth" : 4, 
      "valid_children" : ["root"]
    },
    "root" : {
      "icon" : "/static/3.0.3/assets/images/tree_icon.png",
      "valid_children" : ["default"]
    },
    "default" : {
      "valid_children" : ["default","file"]
    },
    "file" : {
      "icon" : "glyphicon glyphicon-file",
      "valid_children" : []
    }
  },
  "plugins" : [
    "contextmenu", "dnd", "search",
    "state", "types", "wholerow"
  ]

});
console.log('jQuery ready function fired');
});

})();
