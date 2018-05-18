;(function(){

  var NyTimesApp = angular.module('NyTimesMainApp');
  var LOAD_MORE_NEWS = 'LOAD_MORE_NEWS';
  
   /**
   * DISPATCHER CONSTRUCTOR
   */
  class EventEmitter {
    constructor() {
      this.listeners = [];
    }

    emit(event) {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    }

    addListener(listener) {
      this.listeners.push(listener);
      return this.listeners.length - 1;
    }
  }

  NyTimesApp.service("NyTimesDispatcher", EventEmitter);

  /**
   * FluxComponent: ACTIONS for News Page
   */
  NyTimesApp.factory('NewsActions', NewsActionsFunc);

  NewsActionsFunc.$inject = ['NyTimesDispatcher'];

  function NewsActionsFunc(NyTimesDispatcher){
    return {
      //== Load more news page
      loadMoreNews: function(){
        NyTimesDispatcher.emit({
          actionType: LOAD_MORE_NEWS,
          item: null
        })
      } 
    };
  };

  /**
   * FluxComponent: Define NEWS STORE Service
   */
  NyTimesApp.factory('NewsStore', NewsStoreServiceFunc);

  NewsStoreServiceFunc.$inject = ['$rootScope', '$sce', '$http', '$q', 'NyTimesDispatcher'];

  function NewsStoreServiceFunc($rootScope, $sce, $http, $q, NyTimesDispatcher){
    var service = {
      request: {
        api_key: '',
        nation: '',
        page: 0
      },
      data: [],
      currentPage: 0,
      isLoading: false
    };

    //== Define Actions: Register events with Dispatcher
    NyTimesDispatcher.addListener(function (action) {
      switch(action.actionType){
        case LOAD_MORE_NEWS:
          service.request.page = service.currentPage + 1;
          service.loadData();
          break;
      }
    });

    //== Prototype: Emit change
    service.emitChange = function(){
      NyTimesDispatcher.emit('change');
    };

    //== Prototype: Init
    service.init = function(options){
        this.request.api_key = options.api_key != undefined ? options.api_key : null;
        this.request.nation = options.nation != undefined ? options.nation : 'singapore';
        
        this.loadData(true);

        return this;
    };

    //== Prototype: Load data
    service.loadData = function(){
      var self = this;

      //== Check if API Key is wrong
      if (self.request.api_key == null) {
        
        console.error('API key is wrong.');
        return false;

      } else {

        var deferred = $q.defer();
        var self = this;
        
        self.isLoading = true;
        
        $http({
          method : 'GET',
          url: "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + "api-key=" + self.request.api_key + "&q=" + self.request.nation + "&page=" + self.request.page,
          async: false
        })
        .then(function successCallback(response) {
          if (response.data.status != undefined && response.data.status == 'OK') {
            self.data[self.request.page] = response.data.response.docs;
            console.log(self.data);
            self.currentPage = self.request.page;
            
            deferred.resolve(response);
          }
          
          self.isLoading = false;
          
        }, function errorCallback(response) {
          
          deferred.reject(error);
          self.isLoading = false;
        });
        
        return deferred.promise;
      }
    };

    return service;
  };

  
})()


