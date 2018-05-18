;(function(){

  /**
   * NYTimes app: Home Controller
   */
  var NyTimesApp = angular.module('NyTimesMainApp');

  NyTimesApp.controller('NyTimesNewsCtrl', NyTimesNewsCtrlInit)
    .filter('to_trusted',
      ['$sce', function($sce){
        return function(text) {
          return $sce.trustAsHtml(text);
        }
      }]
    );

  NyTimesNewsCtrlInit.$inject = ['$scope', '$sce', 'NewsStore', 'NewsActions'];
  
  function NyTimesNewsCtrlInit($scope, $sce, NewsStore, NewsActions){
    
    $scope.news_store = NewsStore.init({
      api_key: '092b8aac63e3484ea21a5245dfe44acc'
    });

    $scope.news_actions = NewsActions;

    $scope.loadMoreNews = function(){
      $scope.news_actions.loadMoreNews();
    };

    
  };
  
})()