(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.theme_formation')
        .controller('ThemeformationController', ThemeformationController);

    /** @ngInject */
    function ThemeformationController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore,$mdSidenav)
	{		
		var vm = this;
		var id_utilisateur = $cookieStore.get('id');
    vm.serveur_central = serveur_central ;
     
    vm.allTheme_formation = [] ;
    vm.selectedItem_theme_formation = {} ;
    var current_selectedItem_theme_formation = {} ;
    vm.nouvelleItem_theme_formation = false ;
    
    vm.allTheme_formation_detail = [] ;
    vm.selectedItem_theme_formation_detail = {} ;
    var current_selectedItem_theme_formation_detail = {} ;
    vm.nouvelleItem_theme_formation_detail = false ;

    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true,
      order:[]          
    }; 
    vm.affiche_load = true
    apiFactory.getAll("theme_formation/index").then(function(result)
    {
      vm.allTheme_formation = result.data.response;
      vm.affiche_load = false ;
    });

/******************************theme formation */
vm.theme_formation_column =
    [
      {titre:"Code "},
      {titre:"Description "},

    ];
		vm.affiche = true;
vm.selection_theme_formation = function(item)
{
  vm.selectedItem_theme_formation = item ;

  if (!vm.selectedItem_theme_formation.$edit) //si simple selection
  {
    vm.nouvelleItem_theme_formation = false ;  

  }

}

$scope.$watch('vm.selectedItem_theme_formation', function()
{
  if (!vm.allTheme_formation) return;
  vm.allTheme_formation.forEach(function(item)
  {
    item.$selected = false;
  });
  vm.selectedItem_theme_formation.$selected = true;

});

vm.ajouter_theme_formation = function()
{
  vm.nouvelleItem_theme_formation = true ;
  var item = 
    {
      
      $edit: true,
      $selected: true,
              id:'0',                     
              code:'', ///amboarina
              description:''
             
    } ;

  vm.allTheme_formation.unshift(item);
        vm.allTheme_formation.forEach(function(af)
        {
          if(af.$selected == true)
          {
            vm.selectedItem_theme_formation = af;
            
          }
        });
}

vm.modifier_theme_formation = function()
{
  vm.nouvelleItem_theme_formation = false ;
  vm.selectedItem_theme_formation.$edit = true;
  vm.selectedItem_theme_formation.code = vm.selectedItem_theme_formation.code;
  vm.selectedItem_theme_formation.description = vm.selectedItem_theme_formation.description;  

  current_selectedItem_theme_formation = angular.copy(vm.selectedItem_theme_formation);
}

vm.supprimer_theme_formation = function()
{

  
  var confirm = $mdDialog.confirm()
    .title('Etes-vous sûr de supprimer cet enregistrement ?')
    .textContent('Cliquer sur OK pour confirmer')
    .ariaLabel('Lucky day')
    .clickOutsideToClose(true)
    .parent(angular.element(document.body))
    .ok('OK')
    .cancel('Annuler');
  $mdDialog.show(confirm).then(function() {

  vm.enregistrer_theme_formation(1);
  }, function() {
  //alert('rien');
  });
}

vm.annuler_theme_formation = function()
{
  if (vm.nouvelleItem_theme_formation) 
  {
    
    vm.allTheme_formation.shift();
    vm.selectedItem_theme_formation = {} ;
    vm.nouvelleItem_theme_formation = false ;
  }
  else
  {
    

    if (!vm.selectedItem_theme_formation.$edit) //annuler selection
    {
      vm.selectedItem_theme_formation.$selected = false;
      vm.selectedItem_theme_formation = {};
    }
    else
    {
      vm.selectedItem_theme_formation.$selected = false;
      vm.selectedItem_theme_formation.$edit = false;              
      vm.selectedItem_theme_formation.code = current_selectedItem_theme_formation.code ;
      vm.selectedItem_theme_formation.description = current_selectedItem_theme_formation.description ;             
      vm.selectedItem_theme_formation = {};
    }

  }
}

vm.enregistrer_theme_formation = function(etat_suppression)
{
  vm.affiche_load = true ;
  var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };


        var datas = $.param(
        {
          
            supprimer:etat_suppression,
            id:vm.selectedItem_theme_formation.id,
           
            code : vm.selectedItem_theme_formation.code ,
            description : vm.selectedItem_theme_formation.description ,                    
            
            
        });
        apiFactory.add("theme_formation/index",datas, config).success(function (data)
      {
        vm.affiche_load = false ;
        if (!vm.nouvelleItem_theme_formation) 
        {
          if (etat_suppression == 0) 
          {
            vm.selectedItem_theme_formation.$edit = false ;
            vm.selectedItem_theme_formation.$selected = false ; 
            vm.selectedItem_theme_formation = {} ;
          }
          else
          {
            vm.allTheme_formation = vm.allTheme_formation.filter(function(obj)
            {
              return obj.id !== vm.selectedItem_theme_formation.id;
            });

        vm.selectedItem_theme_formation = {} ;
          }

        }
        else
        {
          vm.selectedItem_theme_formation.$edit = false ;
          vm.selectedItem_theme_formation.$selected = false ;
          vm.selectedItem_theme_formation.id = String(data.response) ;

          vm.nouvelleItem_theme_formation = false ;
          vm.selectedItem_theme_formation = {};

        }
      })
      .error(function (data) {alert("Une erreur s'est produit");}); 
}
vm.change_description = function(item)
{
  if (item.description)
  {
    var stringdescription=vm.selectedItem_theme_formation.description.toString();
    var uppercasedescription=stringdescription.toUpperCase()
    var cod= uppercasedescription.substr(0, 4);
    if (vm.nouvelleItem_theme_formation==true)
    {
      apiFactory.getAPIgeneraliserREST("theme_formation/index","menu","getformationbycode","code",cod).then(function success(response)
      {
          var theme_meme_code = response.data.response;
          if (theme_meme_code.length!=0)
          {
            var anciencode=theme_meme_code[0].code.slice(4);
            var numerocode =parseInt(anciencode)+1; 
            var nouveaucode=cod + numerocode;
            console.log(nouveaucode);
            item.code=nouveaucode;
          }
          else
          {
            item.code=cod + 1;
            console.log(cod + 1);
          }
          
      });
    }
    else
    {
      apiFactory.getAPIgeneraliserREST("theme_formation/index","menu","getformationbycode","code",cod).then(function success(response)
      {
          //var theme_meme_code = response.data.response;
          var theme_meme_code = response.data.response.filter(function(obj)
          {
            return obj.id !== vm.selectedItem_theme_formation.id;
          });
          if (theme_meme_code.length!=0)
          {
            var anciencode=theme_meme_code[0].code.slice(4);
            console.log(anciencode);
            var numerocode =parseInt(anciencode)+1; console.log(numerocode);
            var nouveaucode=cod + numerocode;
            console.log(nouveaucode);
            item.code=nouveaucode;
          }
          else
          {
            item.code=cod + 1;
            console.log(cod + 1);
          }
          
      });
    }
  }
  else
  {
    item.code=null;
  }  
              
}
/******************************theme formation */

/******************************theme formation detail */

vm.get_theme_formation_detail = function()
{
  
    apiFactory.getAPIgeneraliserREST("theme_formation_detail/index","cle_etrangere",vm.selectedItem_theme_formation.id).then(function(result)
    {
      vm.allTheme_formation_detail= result.data.response;

    });
}
vm.theme_formation_detail_column =
    [
      {titre:"Code "},
      {titre:"Description "},

    ];
		vm.affiche = true;
vm.selection_theme_formation_detail = function(item)
{
  vm.selectedItem_theme_formation_detail = item ;

  if (!vm.selectedItem_theme_formation_detail.$edit) //si simple selection
  {
    vm.nouvelleItem_theme_formation_detail = false ;  

  }

}

$scope.$watch('vm.selectedItem_theme_formation_detail', function()
{
  if (!vm.allTheme_formation_detail) return;
  vm.allTheme_formation_detail.forEach(function(item)
  {
    item.$selected = false;
  });
  vm.selectedItem_theme_formation_detail.$selected = true;

});

vm.ajouter_theme_formation_detail = function()
{
  vm.nouvelleItem_theme_formation_detail = true ;
  var item = 
    {
      
      $edit: true,
      $selected: true,
              id:'0',                     
              code:'', ///amboarina
              description:'',
              id_theme_formation: vm.selectedItem_theme_formation.id
             
    } ;

  vm.allTheme_formation_detail.unshift(item);
        vm.allTheme_formation_detail.forEach(function(af)
        {
          if(af.$selected == true)
          {
            vm.selectedItem_theme_formation_detail = af;
            
          }
        });
}

vm.modifier_theme_formation_detail = function()
{
  vm.nouvelleItem_theme_formation_detail = false ;
  vm.selectedItem_theme_formation_detail.$edit = true;
  vm.selectedItem_theme_formation_detail.code = vm.selectedItem_theme_formation_detail.code;
  vm.selectedItem_theme_formation_detail.description = vm.selectedItem_theme_formation_detail.description;  

  current_selectedItem_theme_formation_detail = angular.copy(vm.selectedItem_theme_formation_detail);
}

vm.supprimer_theme_formation_detail = function()
{

  
  var confirm = $mdDialog.confirm()
    .title('Etes-vous sûr de supprimer cet enregistrement ?')
    .textContent('Cliquer sur OK pour confirmer')
    .ariaLabel('Lucky day')
    .clickOutsideToClose(true)
    .parent(angular.element(document.body))
    .ok('OK')
    .cancel('Annuler');
  $mdDialog.show(confirm).then(function() {

  vm.enregistrer_theme_formation_detail(1);
  }, function() {
  //alert('rien');
  });
}

vm.annuler_theme_formation_detail = function()
{
  if (vm.nouvelleItem_theme_formation_detail) 
  {
    
    vm.allTheme_formation_detail.shift();
    vm.selectedItem_theme_formation_detail = {} ;
    vm.nouvelleItem_theme_formation_detail = false ;
  }
  else
  {
    

    if (!vm.selectedItem_theme_formation_detail.$edit) //annuler selection
    {
      vm.selectedItem_theme_formation_detail.$selected = false;
      vm.selectedItem_theme_formation_detail = {};
    }
    else
    {
      vm.selectedItem_theme_formation_detail.$selected = false;
      vm.selectedItem_theme_formation_detail.$edit = false;              
      vm.selectedItem_theme_formation_detail.code = current_selectedItem_theme_formation_detail.code ;
      vm.selectedItem_theme_formation_detail.description = current_selectedItem_theme_formation_detail.description ;             
      vm.selectedItem_theme_formation_detail = {};
    }

  }
}

vm.enregistrer_theme_formation_detail = function(etat_suppression)
{
  vm.affiche_load = true ;
  var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };


        var datas = $.param(
        {
          
            supprimer:etat_suppression,
            id:vm.selectedItem_theme_formation_detail.id,
           
            code : vm.selectedItem_theme_formation_detail.code ,
            description : vm.selectedItem_theme_formation_detail.description ,
            id_theme_formation : vm.selectedItem_theme_formation_detail.id_theme_formation ,                    
            
            
        });
        apiFactory.add("theme_formation_detail/index",datas, config).success(function (data)
      {
        vm.affiche_load = false ;
        if (!vm.nouvelleItem_theme_formation_detail) 
        {
          if (etat_suppression == 0) 
          {
            vm.selectedItem_theme_formation_detail.$edit = false ;
            vm.selectedItem_theme_formation_detail.$selected = false ; 
            vm.selectedItem_theme_formation_detail = {} ;
          }
          else
          {
            vm.allTheme_formation_detail = vm.allTheme_formation_detail.filter(function(obj)
            {
              return obj.id !== vm.selectedItem_theme_formation_detail.id;
            });

        vm.selectedItem_theme_formation_detail = {} ;
          }

        }
        else
        {
          vm.selectedItem_theme_formation_detail.$edit = false ;
          vm.selectedItem_theme_formation_detail.$selected = false ;
          vm.selectedItem_theme_formation_detail.id = String(data.response) ;

          vm.nouvelleItem_theme_formation_detail = false ;
          vm.selectedItem_theme_formation_detail = {};

        }
      })
      .error(function (data) {alert("Une erreur s'est produit");}); 
}
vm.change_description_detail = function(item)
{
  if (item.description)
  {
    var stringdescription=vm.selectedItem_theme_formation_detail.description.toString();
    var uppercasedescription=stringdescription.toUpperCase()
    var cod= uppercasedescription.substr(0, 4);
    if (vm.nouvelleItem_theme_formation_detail==true)
    {
      apiFactory.getAPIgeneraliserREST("theme_formation_detail/index","menu","getformationbycode","code",cod).then(function success(response)
      {
          var theme_meme_code = response.data.response;
          if (theme_meme_code.length!=0)
          {
            var anciencode=theme_meme_code[0].code.slice(4);
            var numerocode =parseInt(anciencode)+1; 
            var nouveaucode=cod + numerocode;
            console.log(nouveaucode);
            item.code=nouveaucode;
          }
          else
          {
            item.code=cod + 1;
            console.log(cod + 1);
          }
          
      });
    }
    else
    {
      apiFactory.getAPIgeneraliserREST("theme_formation_detail/index","menu","getformationbycode","code",cod).then(function success(response)
      {
          //var theme_meme_code = response.data.response;
          var theme_meme_code = response.data.response.filter(function(obj)
          {
            return obj.id !== vm.selectedItem_theme_formation_detail.id;
          });
          if (theme_meme_code.length!=0)
          {
            var anciencode=theme_meme_code[0].code.slice(4);
            console.log(anciencode);
            var numerocode =parseInt(anciencode)+1; console.log(numerocode);
            var nouveaucode=cod + numerocode;
            console.log(nouveaucode);
            item.code=nouveaucode;
          }
          else
          {
            item.code=cod + 1;
            console.log(cod + 1);
          }
          
      });
    }
  }
  else
  {
    item.code=null;
  }  
              
}
/******************************theme formation */
    

		/* ***************Debut Thème formation**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation Theme
                read: function (e)
                {
                    apiFactory.getAll("theme_formation/index").then(function success(response)
                    {
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification Theme
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:        e.data.models[0].code,      
                          description:      e.data.models[0].description
                      });
                  apiFactory.add("theme_formation/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification :  Thème formation de description " + e.data.models[0].description,
                              id_utilisateur: id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                   
                     
                },
                //suppression Theme
                destroy: function (e)
                {
					// Demande de confirmation de suppression
					var confirm = $mdDialog.confirm()
						.title('Etes-vous sûr de supprimer cet enregistrement ?')
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('supprimer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {  
						// demande de confirmation de suppression OK => enregitrement à supprimer
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
						var datas = $.param({
								supprimer: 1,
								id:        e.data.models[0].id               
							});
						apiFactory.add("theme_formation/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Thème formation de description " + e.data.models[0].description,
									  id_utilisateur: id_utilisateur
							  });
									
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
						  /***********Fin add historique***********/
						}).error(function (data) {
							vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
						});
					}, function() {
						// Aucune action = sans suppression            
						vm.mainGridOptions.dataSource.read();
					});               
                },
                //creation Theme
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            code:       e.data.models[0].code,             
                            description:       e.data.models[0].description              
                        });
                    apiFactory.add("theme_formation/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);

                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Thème formation de description " + e.data.models[0].description,
                                id_utilisateur: id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/

                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });
                }
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            change: onChange,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string", editable: false},
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
               template: '<label id="table_titre">Thème formation</label>'
			   				+'<a class="k-button k-button-icontext k-grid-add addindicateur" href="\\#" ng-if="vm.serveur_central">' 
			   				+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addindicateur" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'theme_formation\/index\',\'theme_formation\')">' 
			   				+'<md-icon md-font-icon="icon-box-download"></md-icon>'
							+'<md-tooltip><span>Download</span></md-tooltip>'
						+'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };
          function onChange(e) {
            console.log(e);
            if (e.action == "itemchange" && e.field == "description")
            { 
              console.log('description');
              var stringdescription=e.items[0].description.toString();
              var uppercasedescription=stringdescription.toUpperCase()
             var cod= uppercasedescription.substr(0, 4);
             apiFactory.getAPIgeneraliserREST("theme_formation/index","menu","getformationbycode","code",cod).then(function success(response)
             {
                var theme_meme_code = response.data.response;
                if (theme_meme_code.length!=0)
                {
                  var anciencode=theme_meme_code[0].code.slice(4);
                  console.log(anciencode);
                  var numerocode =toString(parseInt(anciencode)+1); 
                  var nouveaucode=cod + numerocode;
                  console.log(nouveaucode);
                  e.items[0].code=nouveaucode;
                }
                else
                {
                  e.items[0].code=cod + 1;
                  console.log(cod + 1);
                }
                console.log(e);
             });
             
              
              /*var grid = $("#grid").data("kendoGrid");
              var dataItem = grid.dataSource.get(editItemModelId);
              dataItem.set("Discontinued", true);*/
            }
          }
      /* ***************Fin Thème formation**********************/ 
	  
	  /* ***************Debut détail Thème formation**********************/

      vm.all_theme_formation_detail = function(theme_formation_id) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation district
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("theme_formation_detail/index","cle_etrangere",theme_formation_id).then(function(result)
                {
                    e.success(result.data.response);

                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification district
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_theme_formation: theme_formation_id               
                      });
                  apiFactory.add("theme_formation_detail/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Thème de formation de description de " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });       
              },

              //supression district
              destroy : function (e)
              {
					// Demande de confirmation de suppression
					var confirm = $mdDialog.confirm()
						.title('Etes-vous sûr de supprimer cet enregistrement ?')
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('supprimer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {  
						// demande de confirmation de suppression OK => enregitrement à supprimer
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
						var datas = $.param({
							  supprimer: 1,
							  id:        e.data.models[0].id               
						});                 
						apiFactory.add("theme_formation_detail/index",datas, config).success(function (data) {                
							e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : Thème de formation de description de " + e.data.models[0].description,
									id_utilisateur:vm.id_utilisateur
							});                             
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
							/***********Fin add historique***********/ 
						}).error(function (data) {
							vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
						}); 
					}, function()
          {
						vm.mainGridOptions.dataSource.read();
            
					});					
              },
              //creation district
              create : function (e)
              {
                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_theme_formation: theme_formation_id               
                      });
                  
                  apiFactory.add("theme_formation_detail/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_theme_formation=theme_formation_id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Composant indicateur de description de " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 

                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    }); 

              }
            },
            batch: true,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string", validation: {required: true}},
                        description: {type: "string", validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: '<label id="table_titre">Sous-Thème</label>'
							+'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
							+'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
							+'<md-tooltip><span>Ajout</span></md-tooltip>'
						+'</a>'
						+'<a class="k-button k-button-icontext addcomposant" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb(\'theme_formation_detail\/index\',\'theme_formation_detail\')">' 
							+'<md-icon md-font-icon="icon-box-download"></md-icon>'
							+'<md-tooltip><span>Download</span></md-tooltip>'
						+'</a>'
          }],
          editable: {
            mode:"inline"
          },
          //selectable:"row",
          scrollable: false,
          sortable: true,
          filterable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          //dataBound: function() {
                   // this.expandRow(this.tbody.find("tr.k-master-row").first());
               // },
          columns: [
            {
              field: "code",
              title: "Code",
              width: "Auto"
            },
            {
              field: "description",
              title: "Description",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                     // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
        };
      };
      
	  /* ***************Fin détail Thème formation**********************/    	  
  vm.download_ddb = function(controller,table)
  {
    var nbr_data_insert = 0 ;
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    vm.affiche_load = true;
    apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
      var ddb = result.data.response;

      var datas_suppr = $.param({
          supprimer:1,
          nom_table: table,
        }); 

		apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
          //add ddb
            ddb.forEach( function(element, index)
            {								
              switch (table) {
                case "theme_formation":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    description: element.description
                  });   
                  break;
                case "theme_formation_detail":
                  // statements_1
                  var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                    code: element.code,
                    description: element.description,
                    id_theme_formation: element.id_theme_formation
                  }); 
                  break;
                default:
                  // statements_def
                  break;
              }
              apiFactory.add(controller,datas, config).success(function (data) {
                nbr_data_insert++ ;
                if ((index+1) == ddb.length) //affichage Popup
                {
                  vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s ! Veuillez rafraichir la page');
                  vm.affiche_load = false;
                }
              }).error(function (data) {
                vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
                if ((index+1) == ddb.length) //affichage Popup
                {
                }
                vm.affiche_load = false;
              });
            });
          //add ddb

        }).error(function (data) {
          vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });
    });  
  }
		vm.showAlert = function(titre,textcontent) {
			$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(false)
				.parent(angular.element(document.body))
				.title(titre)
				.textContent(textcontent)
				.ariaLabel('Alert Dialog Demo')
				.ok('Fermer')
				.targetEvent()
			);
		}	
    }
  })();
