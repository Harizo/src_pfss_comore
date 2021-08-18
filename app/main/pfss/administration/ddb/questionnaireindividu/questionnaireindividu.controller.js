(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.questionnaireindividu')
        .controller('QuestionnaireindividuController', QuestionnaireindividuController);
    /** @ngInject */ 
    function QuestionnaireindividuController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore,$rootScope,$location,apiUrlExcel,apiUrlbase,serveur_central)  {
        var vm = this;
        var NouvelItem =false;
        vm.id_utilisateur = $cookieStore.get('id'); 
		vm.ajout = ajout ;
		vm.allReponse=[{id:1,libelle:"Unique"},{id:0,libelle:"Multiple"},{id:2,libelle:"Quantifiée"},{id:3,libelle:"Texte libre"}];
		var NouvelItemQuestionquantifie=false;
		vm.selectedItemQuestion_quantifie={};
		vm.allRecordsQuestion_quantifie=[];
		var currentItemQuestion_quantifie={};
		vm.serveur_central = serveur_central ;
		vm.allRecordsQuestion_quantifie=[];
		vm.quest_quantifie_column =[
		{titre:"Code"},
		{titre:"Description"},
		{titre:"Actions"}
		];
        apiFactory.getAPIgeneraliserREST("variable_individu/index","quantifie",1).then(function(result) { 
			vm.allRecordsQuestion_quantifie = result.data.response;   
        });
/***********DEBUT add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : reponse",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
/***********FIN add historique***********/        
      /* ***************Debut liste variable**********************/  
        vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation liste variable
                read: function (e)
                {
					apiFactory.getAPIgeneraliserREST("liste_variable_individu/index","choix_multiple",1).then(function(result) 
                    {//console.log(result.data.response);
                        e.success(result.data.response);
                    }, function error(result)
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
						  nombre:0,
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
							nombre:0,
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
               template: "<label id='table_titre'>Liste des questionnaire</label>"
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
              title: "Type de réponse",
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
		  
		  
      /* ***************Fin liste variable**********************/
      /* ***************Debut détail variable**********************/
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
						  nombre:0,
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
						  nombre:0,
                          id_liste_variable: id_liste_variable               
                      });
                  apiFactory.add("variable_individu/index",datas, config).success(function (data)
                  {                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].liste_variable={id:id_liste_variable};                                 
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
	// Debut questionnaire quantifiée
		function ajout(agent_e,suppression) {
            
            if (NouvelItemQuestionquantifie==false) 
              {
                test_existence (agent_e,suppression); 
              }
              else
              {
                insert_in_base(agent_e,suppression);
              }
        }
        function insert_in_base(type_pl,suppression) {  
			//add
			
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemQuestionquantifie==false) {
			   getId = vm.selectedItemQuestion_quantifie.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				code: type_pl.code,      
				description: type_pl.description,      
				nombre: 1,
			});       
			//factory
			apiFactory.add("variable_individu/index",datas, config).success(function (data)
			{	
				if (NouvelItemQuestionquantifie == false) {
					// Update or delete: id exclu 
					if(suppression==0) {
					  vm.selectedItemQuestion_quantifie.code = type_pl.code;
					  vm.selectedItemQuestion_quantifie.description = type_pl.description;
					  vm.selectedItemQuestion_quantifie.nombre = 1;
					  vm.selectedItemQuestion_quantifie.$selected = false;
					  vm.selectedItemQuestion_quantifie.$edit = false;
					  vm.selectedItemQuestion_quantifie ={};
					} else {    
						vm.allRecordsQuestion_quantifie = vm.allRecordsQuestion_quantifie.filter(function(obj) {
							return obj.id !== vm.selectedItemQuestion_quantifie.id;
						});
					}
				} else {
					type_pl.id=data.response;
					NouvelItemQuestionquantifie=false;
				}
				type_pl.$selected=false;
				type_pl.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionQuestion_quantifie= function (item) {     
            vm.selectedItemQuestion_quantifie = item;
        };
        $scope.$watch('vm.selectedItemQuestion_quantifie', function() {
			if (!vm.allRecordsQuestion_quantifie) return;
			vm.allRecordsQuestion_quantifie.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemQuestion_quantifie.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterQuestion_quantifie = function () {
            vm.selectedItemQuestion_quantifie.$selected = false;
            NouvelItemQuestionquantifie = true ;
		    var items = {
				$edit: true,
				$selected: true,
				supprimer:0,
                code: '',
                description: '',
                nombre: 1,
			};
			vm.allRecordsQuestion_quantifie.push(items);
		    vm.allRecordsQuestion_quantifie.forEach(function(it) {
				if(it.$selected==true) {
					vm.selectedItemQuestion_quantifie = it;
				}
			});			
        };
        vm.annulerQuestion_quantifie = function(item) {
			if (!item.id) {
				vm.allRecordsQuestion_quantifie.pop();
				return;
			}          
			item.$selected=false;
			item.$edit=false;
			NouvelItemQuestionquantifie = false;
			item.code = currentItemQuestion_quantifie.code;
			item.description = currentItemQuestion_quantifie.description;
			item.nombre = currentItemQuestion_quantifie.nombre;
			vm.selectedItemQuestion_quantifie = {} ;
			vm.selectedItemQuestion_quantifie.$selected = false;
       };
        vm.modifierQuestion_quantifie = function(item) {
			NouvelItemQuestionquantifie = false ;
			vm.selectedItemQuestion_quantifie = item;
			currentItemQuestion_quantifie = angular.copy(vm.selectedItemQuestion_quantifie);
			$scope.vm.allRecordsQuestion_quantifie.forEach(function(it) {
				it.$edit = false;
			});        
			item.$edit = true;	
			item.$selected = true;	
			item.code = vm.selectedItemQuestion_quantifie.code;
			item.description = vm.selectedItemQuestion_quantifie.description;
			item.nombre = vm.selectedItemQuestion_quantifie.nombre;
			item.$edit = true;
			// console.log(vm.allRecordsQuestion_quantifie);	
        };
        vm.supprimerQuestion_quantifie = function() {
			var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
			$mdDialog.show(confirm).then(function() {          
				ajout(vm.selectedItemQuestion_quantifie,1);
			}, function() {
			});
        }
        function test_existence (item,suppression)
        {
			if (suppression!=1) 
            {
                var ag = vm.allRecordsQuestion_quantifie.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0]) {
					if((ag[0].code!=currentItemQuestion_quantifie.code) ||(ag[0].description!=currentItemQuestion_quantifie.description)) { 
                         insert_in_base(item,suppression);                         
					} else  { 
                        item.$selected=false;
						item.$edit=false;
					}
                }
            }
            else
              insert_in_base(item,suppression);		
        }
		// Fin questionnaire quantifiée
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
