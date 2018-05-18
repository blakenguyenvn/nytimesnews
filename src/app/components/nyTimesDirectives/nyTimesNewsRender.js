(function(){
  'use strict';
  
	var NyTimesApp = angular.module('NyTimesMainApp');
	
	/**
	 *  Directive: Grid render
	 */
	NyTimesApp.directive('newsItemRender', newsItemRenderFunc);
	newsItemRenderFunc.$inject = ['$window', '$timeout'];
	
	function newsItemRenderFunc($window, $timeout){
		return {
			restrict : 'A',
			scope: true,
			template: `
			<div class="blog-entry">
				<div class="blog-img">
					<a href="javascript: void(0);" data-toggle="modal" data-target="#{{modal_id}}"><img src="{{thumnail}}" class="img-responsive" alt="html5 bootstrap template"></a>
				</div>
				<div class="desc">
					<p class="meta">
						<h6 class="cat" ng-bind="news_item.type_of_material"></h6>
						<span class="date"><small ng-bind="pub_date"></small></span>
						<span class="pos" ng-if="news_item.source"><small>from <b ng-bind="news_item.source"></b></small></span>
					</p>
					<h2><a href="javascript: void(0);" data-toggle="modal" data-target="#{{modal_id}}" ng-bind="news_item.headline.main"></a></h2>
					<p ng-bind="news_item.snippet"></p>
				</div>
			</div>
			
			<!-- Detail Modal -->
			<div class="modal fade" id="{{modal_id}}" tabindex="-1" role="dialog" aria-labelledby="{{modal_id}}" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div class="modal-content news-detail">
						<div class="modal-header">
							<h5 class="modal-title" ng-bind="news_item.headline.main"></h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<p><img src="{{thumnail}}" class="img-fluid rounded mx-auto d-block" alt="{{news_item.headline.main}}"></p>
							<div class="description">
								<span class="cat" ng-bind="news_item.type_of_material"></span>
								<span class="date"> - <small ng-bind="pub_date"></small></span>
								<span class="pos" ng-if="news_item.source"><small>from <b ng-bind="news_item.source"></b></small></span>
							</div>
							<p ng-bind="news_item.snippet"></p>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							<a href="{{web_url}}" target="_blank" class="btn btn-primary"><i class="fa fa-arrow-circle-right"></i> Read Detail</a>
						</div>
					</div>
				</div>
			</div>
			`,
			link: function(scope, element, attrs){
				//== Format news info
				scope.news_item = scope.$eval(attrs.newsItemRender);
				scope.pub_date = moment(scope.news_item.pub_date).format("MMM Do YY");
				scope.modal_id = 'modal_' + scope.news_item._id;

				//== Create thumbnail url
				scope.thumnail = 'assets/images/default_thumnail.jpg';
				scope.web_url = scope.news_item.web_url;
				scope.web_domain = scope.web_url.replace(/^((\w+:)?\/\/[^\/]+\/?).*$/,'$1');
		
				if (scope.news_item.multimedia[0] != undefined && scope.news_item.multimedia[0] != null) {
					scope.thumnail = scope.web_domain + '/' + scope.news_item.multimedia[0].url;
				}
				
			}
		}
	};
	
})()