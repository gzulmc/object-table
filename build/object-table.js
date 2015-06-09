/**
 * object-table - angular smart table directive
 * @version v0.1.7
 * @author Yauheni Kokatau
 * @license MIT
 */
"use strict";angular.module("objectTable",[]).directive("contenteditable",function(){return{restrict:"A",require:"ngModel",link:function(e,t,r,n){function a(){n.$setViewValue(t.html())}n.$render=function(){t.html(n.$viewValue||"")},t.bind("change blur",function(){e.$apply(a)})}}}),angular.module("objectTable").directive("objectTable",["$compile","$interpolate",function(e,t){return{restrict:"A",replace:!0,templateUrl:"/src/templates/common.html",controller:"objectTableCtrl",controllerAs:"ctrl",transclude:!0,scope:{data:"=",display:"=?",paging:"=?",fromUrl:"@",sortingType:"@?sorting",editable:"=?",select:"@?",selectedModel:"=?"},compile:function(e,t){var r="",n="";return t.addFilter&&(r+=t.addFilter),"false"!==t.sorting&&(r+="| orderBy:sortingArray"),"separate"==t.search?t.fields.split(",").forEach(function(e,t){r+="| filter:{'"+e.trim()+"':columnSearch["+t+"]}"}):("undefined"==typeof t.search||"true"==t.search)&&(r+="| filter:globalSearch"),n+=" | offset: currentPage:display |limitTo: display",e[0].querySelector("#rowTr").setAttribute("ng-repeat","item in $parent.$filtered = (data"+r+")"+n),function(e,t,a,i,o){i._init(),o(e,function(t,a){e.$owner=a.$parent;for(var o in t)t.hasOwnProperty(o)&&"THEAD"==t[o].tagName?i._addHeaderPattern(t[o]):"TBODY"==t[o].tagName?(e.findBody=!0,i._addRowPattern(t[o],r,n)):"TFOOT"==t[o].tagName&&i._addFooterPattern(t[o])})}}}}]),angular.module("objectTable").controller("objectTableCtrl",["$scope","$timeout","$element","$attrs","$http","$compile","$controller",function(e,t,r,n,a,i,o,l){o("objectTableSortingCtrl",{$scope:e});var s=this;this._init=function(){if(e.headers=[],e.fields=[],e.display=e.display||5,e.paging=angular.isDefined(e.paging)?e.paging:!0,e.sortingType=e.sortingType||"simple",e.currentPage=0,e.customHeader=!1,e.search="separate"!==n.search?"undefined"!=typeof n.search?JSON.parse(n.search):!0:n.search,"separate"==e.search&&(e.columnSearch=[]),!n.headers)throw"Required 'headers' attribute is not found!";if(n.headers.split(",").forEach(function(t){e.headers.push(t.trim())}),!n.fields)throw"Sorting is allowed just with specified 'fields' attribute !";n.fields.split(",").forEach(function(t){e.fields.push(t.trim())}),n.fromUrl&&this._loadExternalData(n.fromUrl),e.selectedModel="multiply"===e.select?[]:{}},this._loadExternalData=function(t){e.dataIsLoading=!0,a.get(t).then(function(t){e.data=t.data,e.dataIsLoading=!1})},this._addHeaderPattern=function(t){e.customHeader=!0,r.find("table").prepend(t)},this._addFooterPattern=function(e){r.find("table").prepend(e)},this._addRowPattern=function(t,n,a){t=this._checkEditableContent(t);var o=angular.element(t).find("tr");o.attr("ng-repeat","item in $filtered = (data"+n+")"+a),o.attr("ng-click")||o.attr("ng-click","setSelected(item)"),o.attr("ng-class","{'selected-row':ifSelected(item)}"),r.find("table").append(t.outerHTML),i(r.find("tbody"))(e)},this._checkEditableContent=function(e){return[].forEach.call(e.querySelectorAll("[editable]"),function(e){var t=e.innerHTML.replace("::","").replace("{{","").replace("}}","");e.innerHTML="<span contentEditable ng-model='"+t+"'>"+e.innerHTML.replace("::","")+"</span>"}),e},this.setCurrentPage=function(t){e.currentPage=t},e.setSelected=function(t){"multiply"===e.select?s._containsInSelectArray(t)?e.selectedModel.splice(e.selectedModel.indexOf(t),1):e.selectedModel.push(t):e.selectedModel=t},this._containsInSelectArray=function(t){return e.selectedModel.length?e.selectedModel.filter(function(e){return angular.equals(e,t)}).length>0:void 0},e.ifSelected=function(t){return e.selectedModel&&"multiply"===e.select?s._containsInSelectArray(t):t.$$hashKey==e.selectedModel.$$hashKey}}]),angular.module("objectTable").filter("offset",function(){return function(e,t,r){if(e){t=parseInt(t,10),r=parseInt(r,10);var n=t*r;return e.slice(n,n+r)}}}),angular.module("objectTable").controller("pagingTableCtrl",["$scope","$element","$attrs",function(e,t,r){e.currentPage=0,e.prevPage=function(){e.currentPage>0&&e.currentPage--,e.setCurrentPageToTable()},e.nextPage=function(){e.currentPage<e.pageCount()&&e.currentPage++,e.setCurrentPageToTable()},e.setCurrentPageToTable=function(){e.objectTableCtrl.setCurrentPage(e.currentPage)},e.prevPageDisabled=function(){return 0===e.currentPage?"disabled":""},e.pageCount=function(){return e.count>0?Math.ceil(e.count/e.display)-1:0},e.nextPageDisabled=function(){return e.currentPage===e.pageCount()?"disabled":""},e.setPage=function(t){e.currentPage=t,e.setCurrentPageToTable()},e.range=function(){var t=e.pageCount()+1<5?e.pageCount()+1:5,r=[],n=e.currentPage;n>e.pageCount()-t&&(n=e.pageCount()-t+1);for(var a=n;n+t>a;a++)r.push(a);return r}}]),angular.module("objectTable").controller("objectTableSortingCtrl",["$scope",function(e){e.sort={fields:[],reverse:[]},e.sortingArray=[],e.sortBy=function(t){if(e.data.length){var r=e.headers[e.fields.indexOf(t)];"compound"==e.sortingType?-1==e.sort.fields.indexOf(r)?(e.sort.fields.push(r),e.sortingArray.push(t),e.sort.reverse.push(!1)):e.changeReversing(t,e.sort.fields.indexOf(r)):"simple"==e.sortingType&&(e.sort.fields=[r],e.changeReversing(t))}},e.changeReversing=function(t,r){"compound"==e.sortingType?(e.sort.reverse[r]=!e.sort.reverse[r],e.sortingArray[r]=e.sort.reverse[r]?"-"+t:t):"simple"==e.sortingType&&(e.sort.reverse[0]=!e.sort.reverse[0],e.sortingArray=e.sort.reverse[0]?[t]:["-"+t])},e.headerIsSortedClass=function(t){if(e.sortingArray.length)if("simple"==e.sortingType){if(t==e.sort.fields[0]||"-"+t==e.sort.fields[0])return e.sort.reverse[0]?"table-sort-down":"table-sort-up"}else if("compound"==e.sortingType){var r=e.sort.fields.indexOf(t);if(-1!=r)return e.sort.reverse[r]?"table-sort-down":"table-sort-up"}},e.removeSorting=function(){var t=e.sort.fields.indexOf(this.sortField);t>-1&&(e.sort.fields.splice(t,1),e.sort.reverse.splice(t,1),e.sortingArray.splice(t,1))}}]),angular.module("objectTable").directive("paging",["$compile","$interpolate",function(e,t){return{restrict:"E",replace:!0,templateUrl:"/src/templates/paging.html",controller:"pagingTableCtrl",require:"^objectTable",scope:{count:"=",display:"="},link:function(e,t,r,n){e.objectTableCtrl=n}}}]);
angular.module("objectTable").run(["$templateCache", function($templateCache) {$templateCache.put("/src/templates/common.html","<div class=\"object-table-module\"><div class=\"col-xs-12 col-sm-6 col-md-8 sorting-container\"><div ng-if=\"sortingType && sort.fields.length\">Sorting:<div ng-repeat=\"sortField in sort.fields\" class=\"sorting-badge\"><span class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\':sort.reverse[$index],\n				\'glyphicon-chevron-up\':!sort.reverse[$index]}\"></span> {{::sortField}} <span class=\"glyphicon glyphicon-remove close\" ng-click=\"removeSorting()\"></span></div></div></div><div class=\"form-group col-xs-12 col-sm-6 col-md-4\" ng-if=\"search && search!==\'separate\'\"><input type=\"text\" placeholder=\"Search\" ng-model=\"$parent.globalSearch\" class=\"row pull-right form-control search\"> <i class=\"glyphicon glyphicon-search search_icon\"></i></div><div class=\"clearfix\"></div><div class=\"back-cover\"><table class=\"table table-responsive table-bordered object-table\"><thead ng-if=\"!customHeader\"><tr><th ng-repeat=\"head in headers track by $index\" ng-click=\"sortBy(fields[$index])\" ng-class=\"headerIsSortedClass(head)\" class=\"sortable\">{{::head}}</th></tr></thead><thead ng-if=\"!customHeader&& search===\'separate\'\"><tr><th ng-repeat=\"head in headers track by $index\" class=\"separate\"><i class=\"glyphicon glyphicon-search search_icon separate\"></i> <input type=\"text\" ng-model=\"columnSearch[$index]\" placeholder=\"{{::head}}...\" class=\"form-control search separate\"></th></tr></thead><tbody ng-if=\"!findBody\"><tr id=\"rowTr\" ng-click=\"setSelected(item)\" ng-class=\"{\'selected-row\':ifSelected(item)}\"><!-- <= will inject ng-repeat --><!-- params: headers and fields --><td ng-if=\"!editable\" ng-repeat=\"field in fields\">{{::item[field]}}</td><td ng-if=\"editable\" editable ng-repeat=\"field in fields\"><span contenteditable ng-model=\"item[field]\">{{item[field]}}</span></td></tr></tbody></table></div><div class=\"loading\" ng-show=\"dataIsLoading\"><span class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></span> Loading Data...</div><paging ng-if=\"paging\" data-display=\"display\" count=\"$filtered.length\" class=\"object-table-paging\" ng-hide=\"dataIsLoading\"></paging><div class=\"clearfix\"></div><!-- debug:\n<br>\nSort: {{sort}}\n<br>\nSorting Array: {{sortingArray}}\n<br>\ncurrent Page : {{currentPage}}\n</div> --></div>");
$templateCache.put("/src/templates/paging.html","<div><div class=\"col-xs-9\"><nav ng-hide=\"pageCount()==0\"><ul class=\"pagination\"><li ng-class=\"prevPageDisabled()\"><a href ng-click=\"prevPage()\">« Prev</a></li><li ng-repeat=\"n in range()\" ng-class=\"{active: n == currentPage}\" ng-click=\"setPage(n)\"><a href=\"javascript:void(0)\">{{::n+1}}</a></li><li ng-class=\"nextPageDisabled()\"><a href ng-click=\"nextPage()\">Next »</a></li></ul></nav></div><div class=\"col-xs-3\"><span class=\"label label-default count\">{{count}} <span class=\"records\">records</span></span></div></div>");}]);