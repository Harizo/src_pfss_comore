(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.variableindividu')
        .controller('VariableindividuController', VariableindividuController);
    /** @ngInject */
    function VariableindividuController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore)  {
        var vm = this;
        var NouvelItem =false;
        vm.id_utilisateur = $cookieStore.get('id'); 
		vm.allReponse=[{id:1,libelle:"Oui"},{id:0,libelle:"Non"}];
/***********DEBUT add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : reponse",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
/***********FIN add historique***********/        
      /* ***************Debut liste variable individu**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation liste variable individu
                read: function (e)
                {
                    apiFactory.getAll("liste_variable_individu/index").then(function success(response)
                    {console.log(response.data.response);
                        e.success(response.data.response);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification liste reponse
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:          e.data.models[0].id,      
                          code:        e.data.models[0].code,
                          description: e.data.models[0].description,              
                          choix_unique:       e.data.models[0].liste_reponse.id,
                      });
                  apiFactory.add("liste_variable_individu/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Liste de reponse  " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/
                  }).error(function (data)  {
						vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                                       
                },
                //suppression liste reponse
                destroy: function (e)
                {    // ETO O               
					var confirm = $mdDialog.confirm()
						.title("Vous-êtes en train de supprimer cet enregistrement.Continuer ?")
						.textContent('')
						.ariaLabel('Lucky day')
						.clickOutsideToClose(true)
						.parent(angular.element(document.body))
						.ok('Continuer')
						.cancel('annuler');
					$mdDialog.show(confirm).then(function() {          
						var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
						var datas = $.param({
								supprimer: 1,
								id:        e.data.models[0].id               
							});
						apiFactory.add("liste_variable_individu/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
						  /***********Debut add historique***********/
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Liste reponse  " + e.data.models[0].description,
									  id_utilisateur:vm.id_utilisateur
							  });                               
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
						  /***********Fin add historique***********/
						}).error(function (data)  {
							vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});  
					}, function() {
					});				  
                },
                //creation liste reponse
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            code:      e.data.models[0].code,
                            description:       e.data.models[0].description,             
							choix_unique:       e.data.models[0].liste_reponse,
                        });
                    apiFactory.add("liste_variable_individu/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                     var itemsChoix_unique =
                      {
                        id: e.data.models[0].liste_reponse,
                        libelle: vm.libelleChoixunique
                      };
					  e.data.models[0].liste_reponse=itemsChoix_unique;    
                      e.success(e.data.models);
                      /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Liste de reponse " + e.data.models[0].description,
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
            },               
            //data: valueMapCtrl.dynamicData,
            batch: true,
            // autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        code: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}},
                        liste_reponse: {validation: {required: true}}
                    }
                }
            },
            pageSize: 8 //nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),         
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>Liste des reponses </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"              
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
          scrollable: false,
          sortable: true,
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
              title: "Déscription",
              width: "Auto"
            },
            {
              field: "liste_reponse",
              title: "Choix unique",
              template: "{{dataItem.liste_reponse.libelle}}",
              editor: ChoixuniqueDropDownEditor,
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
          };
		  
		function ChoixuniqueDropDownEditor(container, options) {
            $('<input id="choixuniqueDropDownList" change="vm.mande()" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "choix_unique",
                    dataSource: vm.allReponse         
                }); 
                var choixuniqueContener = container.find("#choixuniqueDropDownList").data("kendoDropDownList");
          
				choixuniqueContener.bind("change", function() {
				vm.libelleChoixunique = choixuniqueContener.text();
				console.log(vm.libelleChoixunique);  
			});
        }
		  
		  
      /* ***************Fin liste variable individu**********************/
      /* ***************Debut détail variable individu**********************/
      vm.alldetailvariable = function(id_liste_variable) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation valeur reponse
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("variable_individu/index","cle_etrangere",id_liste_variable).then(function(result)
                {
                    e.success(result.data.response);
                }, function error(result)
                  {
                      vm.showAlert('Erreur','Erreur de lecture');
                  })
              },
              //modification valeur reponse
              update : function (e)
              {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};               
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_liste_variable: id_liste_variable               
                      });
                  apiFactory.add("variable_individu/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : déscription reponse " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de la modification de donnée');
                    });       
              },
              //supression reponse
              destroy : function (e)
              {			  
				var confirm = $mdDialog.confirm()
					.title("Vous-êtes en train d'importer cet enregistrement.Continuer ?")
					.textContent('')
					.ariaLabel('Lucky day')
					.clickOutsideToClose(true)
					.parent(angular.element(document.body))
					.ok('Continuer')
					.cancel('annuler');
				$mdDialog.show(confirm).then(function() {          
					  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                 
					  var datas = $.param({
							  supprimer: 1,
							  id:        e.data.models[0].id               
						  });                 
					  apiFactory.add("variable_individu/index",datas, config).success(function (data) {                
						e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : reponse " + e.data.models[0].description,
									id_utilisateur:vm.id_utilisateur
							});                             
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
							/***********Fin add historique***********/ 
						}).error(function (data) {
						  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});      
				}, function() {
				});				  
              },
              //creation détail reponse
              create : function (e)
              {                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          code:      e.data.models[0].code,
                          description:       e.data.models[0].description,
                          id_liste_variable: id_liste_variable               
                      });
                  apiFactory.add("variable_individu/index",datas, config).success(function (data)
                  {                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].liste_variable_individu={id:id_liste_variable};                                 
                      e.success(e.data.models);
                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : reponse " + e.data.models[0].description,
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
                        code: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}},
                        choix_unique: {validation: {required: true}}
                    }
                }
            },
            //serverPaging: true,
            //serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
          },
          toolbar: [{               
               template: "<label id='table_titre'>Détail reponse </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"               
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
              title: "Déscription",
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
      /* ***************Fin détail reponse**********************/
        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();
