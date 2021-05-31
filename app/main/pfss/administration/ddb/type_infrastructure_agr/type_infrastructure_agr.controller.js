(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.type_infrastructure_agr')
        .controller('type_infrastructure_agrController', type_infrastructure_agrController);

    /** @ngInject */
    function type_infrastructure_agrController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;
            vm.serveur_central = serveur_central ;


     vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true,
      order:[]          
    };       
    
   

    //type_infrastructure_agr NEW CODE

      vm.all_type_infrastructure_agr = [] ;

      vm.type_infrastructure_agr_column =
      [
        {titre:"Code "},
        {titre:"Libelle "},

      ];
      
        vm.affiche_load = true ;
       /* apiFactory.getAll("Type_infrastructure/index").then(function(result){
          vm.all_type_infrastructure_agr = result.data.response;
          console.log( vm.all_type_infrastructure_agr);
          vm.affiche_load = false ;

        }); */

        apiFactory.getAll("type_infrastructure/index").then(function(result){
          vm.all_type_infrastructure_agr = result.data.response;
          console.log( vm.all_type_infrastructure_agr);
          vm.affiche_load = false ;

        }); 
      

      //type_infrastructure_agr..
        
          vm.selected_type_infrastructure_agr = {} ;
          var current_selected_type_infrastructure_agr = {} ;
           vm.nouvelle_type_infrastructure_agr = false ;

        
        vm.selection_type_infrastructure_agr = function(item)
        {
          vm.selected_type_infrastructure_agr = item ;

          if (!vm.selected_type_infrastructure_agr.$edit) //si simple selection
          {
            vm.nouvelle_type_infrastructure_agr = false ;  

          }
          console.log(vm.selected_type_infrastructure_agr);

        }

        $scope.$watch('vm.selected_type_infrastructure_agr', function()
        {
          if (!vm.all_type_infrastructure_agr) return;
          vm.all_type_infrastructure_agr.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_type_infrastructure_agr.$selected = true;

        });

        vm.ajouter_type_infrastructure_agr = function()
        {
          vm.nouvelle_type_infrastructure_agr = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      code:'', ///amboarina
                      libelle:''
                     
            } ;

          vm.all_type_infrastructure_agr.unshift(item);
                vm.all_type_infrastructure_agr.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_type_infrastructure_agr = af;
                    
                  }
                });
        }
        console.log(vm.ajouter_type_infrastructure_agr);

        vm.modifier_type_infrastructure_agr = function()
        {
          vm.nouvelle_type_infrastructure_agr = false ;
          vm.selected_type_infrastructure_agr.$edit = true;
          vm.selected_type_infrastructure_agr.code = vm.selected_type_infrastructure_agr.code;
          vm.selected_type_infrastructure_agr.libelle = vm.selected_type_infrastructure_agr.libelle;
          
        
          current_selected_type_infrastructure_agr = angular.copy(vm.selected_type_infrastructure_agr);
        }

        vm.supprimer_type_infrastructure_agr = function()
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

          vm.enregistrer_type_infrastructure_agr(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_type_infrastructure_agr = function()
        {
          if (vm.nouvelle_type_infrastructure_agr) 
          {
            
            vm.all_type_infrastructure_agr.shift();
            vm.selected_type_infrastructure_agr = {} ;
            vm.nouvelle_type_infrastructure_agr = false ;
          }
          else
          {
            

            if (!vm.selected_type_infrastructure_agr.$edit) //annuler selection
            {
              vm.selected_type_infrastructure_agr.$selected = false;
              vm.selected_type_infrastructure_agr = {};
            }
            else
            {
              vm.selected_type_infrastructure_agr.$selected = false;
              vm.selected_type_infrastructure_agr.$edit = false;              
              vm.selected_type_infrastructure_agr.Code = current_selected_type_infrastructure_agr.Code ;
              vm.selected_type_infrastructure_agr.Libelle = current_selected_type_infrastructure_agr.Libelle ;             
              vm.selected_type_infrastructure_agr = {};
            }

            console.log(vm.selected_type_infrastructure_agr)

          }
        }

        vm.enregistrer_type_infrastructure_agr = function(etat_suppression)
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
                    id:vm.selected_type_infrastructure_agr.id,
                   
                    code : vm.selected_type_infrastructure_agr.code ,
                    libelle : vm.selected_type_infrastructure_agr.libelle ,                    
                    
                    
                });
                

                apiFactory.add("type_infrastructure/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_type_infrastructure_agr) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_type_infrastructure_agr.$edit = false ;
                    vm.selected_type_infrastructure_agr.$selected = false ; 
                    vm.selected_type_infrastructure_agr = {} ;
                  }
                  else
                  {
                    vm.all_type_infrastructure_agr = vm.all_type_infrastructure_agr.filter(function(obj)
                {
                  return obj.id !== vm.selected_type_infrastructure_agr.id;
                });

                vm.selected_type_infrastructure_agr = {} ;
                  }

                }
                else
                {
                  vm.selected_type_infrastructure_agr.$edit = false ;
                  vm.selected_type_infrastructure_agr.$selected = false ;
                  vm.selected_type_infrastructure_agr.id = String(data.response) ;

                  vm.nouvelle_type_infrastructure_agr = false ;
                  vm.selected_type_infrastructure_agr = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }

        //AGR NEW CODE

      vm.all_agr = [] ;

      vm.agr_column =
      [
        {titre:"Code "},
        {titre:"Libelle "}
      ];

      vm.affiche_load = false ;

      vm.get_all_agr = function () 
      {
        vm.affiche_load = true ;
        apiFactory.getAll("type_agr/index").then(function(result){
          vm.all_agr = result.data.response;
          console.log(result.data);
          vm.affiche_load = false ;

        });  
      }

      //agr..
        
          vm.selected_agr = {} ;
          var current_selected_agr = {} ;
           vm.nouvelle_agr = false ;

        
        vm.selection_agr = function(item)
        {
          vm.selected_agr= item ;

          if (!vm.selected_agr.$edit) //si simple selection
          {
            vm.nouvelle_agr = false ;  

          }

        }

        $scope.$watch('vm.selected_agr', function()
        {
          if (!vm.all_agr) return;
          vm.all_agr.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_agr.$selected = true;

        });

        vm.ajouter_agr = function()
        {
          vm.nouvelle_agr = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',
                      code:'',                      
                      libelle:''
                      
            } ;

          vm.all_agr.unshift(item);
                vm.all_agr.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_agr = af;
                    
                  }
                });
        }

         vm.modifier_agr = function()
        {
          vm.nouvelle_agr = false ;
          vm.selected_agr.$edit = true;
          vm.selected_agr.code = vm.selected_agr.code;
          vm.selected_agr.libelle = vm.selected_agr.ibelle;
          
        
          current_selected_agr = angular.copy(vm.selected_agr);
        }




        vm.supprimer_agr = function()
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

          vm.enregistrer_agr(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_agr = function()
        {
          if (vm.nouvelle_agr) 
          {
            
            vm.all_agr.shift();
            vm.selected_agr = {} ;
            vm.nouvelle_agr = false ;
          }
          else
          {
            

            if (!vm.selected_agr.$edit) //annuler selection
            {
              vm.selected_agr.$selected = false;
              vm.selected_agr = {};
            }
            else
            {
              vm.selected_agr.$selected = false;
              vm.selected_agr.$edit = false;
              vm.selected_agr.code_agr = current_selected_agr.code ;
              vm.selected_agr.libelle_agr = current_selected_agr.libelle ;
              
              
              vm.selected_agr = {};
            }

            

          }
        }

        vm.enregistrer_agr = function(etat_suppression)
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
                    id:vm.selected_agr.id,
                   
            code : vm.selected_agr.code ,
            libelle : vm.selected_agr.libelle 
                    
                    
                });

                apiFactory.add("type_agr/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_agr) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_agr.$edit = false ;
                    vm.selected_agr.$selected = false ;
                    vm.selected_agr = {} ;
                  }
                  else
                  {
                    vm.all_agr = vm.all_agr.filter(function(obj)
                {
                  return obj.id !== vm.selected_agr.id;
                });

                vm.selected_agr = {} ;
                  }

                }
                else
                {
                  vm.selected_agr.$edit = false ;
                  vm.selected_agr.$selected = false ;
                  vm.selected_agr.id = String(data.response) ;

                  vm.nouvelle_agr = false ;
                  vm.selected_agr = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");});
        }

        //Type activite ACT NEW CODE

      vm.all_type_activite_act = [] ;

      vm.type_activite_act_column =
      [
        {titre:"Code "},
        {titre:"Libelle "}
      ];

      vm.affiche_load = false ;

      
              
      vm.affiche_load = true ;
        apiFactory.getAll("type_activite_act/index").then(function(result){
          vm.all_type_activite_act = result.data.response;
          console.log(result.data);
          vm.affiche_load = false ;
        });



      //agr..
        
          vm.selected_type_activite_act = {} ;
          var current_selected_type_activite_act = {} ;
           vm.nouvelle_type_activite_act = false ;

        
        vm.selection_type_activite_act = function(item)
        {
          vm.selected_type_activite_act= item ;

          if (!vm.selected_type_activite_act.$edit) //si simple selection
          {
            vm.nouvelle_type_activite_act = false ;  

          }

        }

        $scope.$watch('vm.selected_type_activite_act', function()
        {
          if (!vm.all_type_activite_act) return;
          vm.all_type_activite_act.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_type_activite_act.$selected = true;

        });

        vm.ajouter_type_activite_act = function()
        {
          vm.nouvelle_type_activite_act = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',
                      code:'',                      
                      libelle:''
                      
            } ;

          vm.all_type_activite_act.unshift(item);
                vm.all_type_activite_act.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_type_activite_act = af;
                    
                  }
                });
        }

        vm.modifier_type_activite_act= function()
        {
          vm.nouvelle_type_activite_act = false ;
          vm.selected_type_activite_act.$edit = true;
        
          current_selected_type_activite_act = angular.copy(vm.selected_type_activite_act);
        }

        

        vm.supprimer_type_activite_act= function()
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

          vm.enregistrer_type_activite_act(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_type_activite_act = function()
        {
          if (vm.nouvelle_type_activite_act) 
          {
            
            vm.all_type_activite_act.shift();
            vm.selected_type_activite_act = {} ;
            vm.nouvelle_type_activite_act = false ;
          }
          else
          {
            

            if (!vm.selected_type_activite_act.$edit) //annuler selection
            {
              vm.selected_type_activite_act.$selected = false;
              vm.selected_type_activite_act = {};
            }
            else
            {
              vm.selected_type_activite_act.$selected = false;
              vm.selected_type_activite_act.$edit = false;
              vm.selected_type_activite_act.Code_agr = current_selected_type_activite_act.Code_type_activite_act ;
              vm.selected_agr.Libelle_type_activite_act = current_selected_type_activite_act.Libelle_type_activite_act ;
              
              
              vm.selected_type_activite_act = {};
            }

            

          }
        }

        vm.enregistrer_type_activite_act = function(etat_suppression)
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
                    id:vm.selected_type_activite_act.id,
                   
            code : vm.selected_type_activite_act.code ,
            libelle : vm.selected_type_activite_act.libelle 
                    
                    
                });

                apiFactory.add("type_activite_act/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_type_activite_act) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_type_activite_act.$edit = false ;
                    vm.selected_type_activite_act.$selected = false ;
                    vm.selected_type_activite_act = {} ;
                  }
                  else
                  {
                    vm.all_type_activite_act = vm.all_type_activite_act.filter(function(obj)
                {
                  return obj.id !== vm.selected_type_activite_act.id;
                });

                vm.selected_type_activite_act = {} ;
                  }

                }
                else
                {
                  vm.selected_type_activite_act.$edit = false ;
                  vm.selected_type_activite_act.$selected = false ;
                  vm.selected_type_activite_act.id = String(data.response) ;

                  vm.nouvelle_type_activite_act = false ;
                  vm.selected_type_activite_act = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");});
        }

        //activite_act NEW CODE

      vm.all_activite_act = [] ;

      vm.activite_act_column =
      [
        {titre:"Code "},
        {titre:"Libelle "},

      ];
      
        vm.affiche_load = true ;
       /* apiFactory.getAll("Type_infrastructure/index").then(function(result){
          vm.all_type_infrastructure_agr = result.data.response;
          console.log( vm.all_type_infrastructure_agr);
          vm.affiche_load = false ;

        }); */

        apiFactory.getAll("activite_act/index").then(function(result){
          vm.all_activite_act = result.data.response;
          console.log( vm.all_activite_act);
          vm.affiche_load = false ;

        }); 
         vm.get_all_activite_act = function()
         {
                    apiFactory.getAPIgeneraliserREST("activite_act/index","menu","getactivite_actbytype","id_type_activite_act",vm.selected_type_activite_act.id).then(function(result)
                    {
                        vm.all_activite_act = result.data.response;
                     });
                     
          }
          
      

      //activite_act...
        
          vm.selected_activite_act = {} ;
          var current_selected_activite_act = {} ;
           vm.nouvelle_activite_act = false ;

        
        vm.selection_activite_act = function(item)
        {
          vm.selected_activite_act = item ;

          if (!vm.selected_activite_act.$edit) //si simple selection
          {
            vm.nouvelle_activite_act = false ;  

          }
          console.log(vm.selected_activite_act);

        }

        $scope.$watch('vm.selected_activite_act', function()
        {
          if (!vm.all_activite_act) return;
          vm.all_activite_act.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_activite_act.$selected = true;

        });

        vm.ajouter_activite_act = function()
        {
          vm.nouvelle_activite_act = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      code:'', ///amboarina
                      libelle:''
                     
            } ;

          vm.all_activite_act.unshift(item);
                vm.all_activite_act.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_activite_act = af;
                    
                  }
                });
        }
        console.log(vm.ajouter_activite_act);

        vm.modifier_activite_act = function()
        {
          vm.nouvelle_activite_act = false ;
          vm.selected_activite_act.$edit = true;
          vm.selected_activite_act.code = vm.selected_activite_act.code;
          vm.selected_activite_act.libelle = vm.selected_activite_act.libelle;
          
        
          current_selected_activite_act = angular.copy(vm.selected_activite_act);
        }

        vm.supprimer_activite_act = function()
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

          vm.enregistrer_activite_act(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_activite_act = function()
        {
          if (vm.nouvelle_activite_act) 
          {
            
            vm.all_activite_act.shift();
            vm.selected_activite_act = {} ;
            vm.nouvelle_activite_act = false ;
          }
          else
          {
            

            if (!vm.selected_activite_act.$edit) //annuler selection
            {
              vm.selected_activite_act.$selected = false;
              vm.selected_activite_act = {};
            }
            else
            {
              vm.selected_activite_act.$selected = false;
              vm.selected_acctivite_act.$edit = false;              
              vm.selected_activite_act.code = current_selected_activite_act.code ;
              vm.selected_activite_actr.libelle = current_selected_activite_act.libelle ;             
              vm.selected_activite_actr = {};
            }

            console.log(vm.selected_activite_act)

          }
        }

        vm.enregistrer_activite_act = function(etat_suppression)
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
                    id:vm.selected_activite_act.id,
                   id_type_activite_act: vm.selected_type_activite_act.id,
                    code : vm.selected_activite_act.code ,
                    libelle : vm.selected_activite_act.libelle ,                    
                    
                    
                });
                

                apiFactory.add("activite_act/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_activite_act) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_activite_act.$edit = false ;
                    vm.selected_activite_act.$selected = false ; 
                    vm.selected_activite_act = {} ;
                  }
                  else
                  {
                    vm.all_activite_act = vm.all_activite_act.filter(function(obj)
                {
                  return obj.id !== vm.selected_activite_act.id;
                });

                vm.selected_activite_act = {} ;
                  }

                }
                else
                {
                  vm.selected_activite_act.$edit = false ;
                  vm.selected_activite_act.$selected = false ;
                  vm.selected_activite_act.id = String(data.response) ;

                  vm.nouvelle_activite_act = false ;
                  vm.selected_activite_act = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }




      

      //fin activite-act..

      


      //fin type_infrastructure_agr..
    //FIN type_infrastructure_agr NEW CODE   
    
 

      /*  vm.modifierRegion = function (item) { 
      vm.allregion.forEach(function(prg) {
        if(prg.id==item.id_region) {
          item.region=[];
          var itemss = {
            id: prg.id,
            code: prg.code,
            nom: prg.nom,
          };
          item.region.push(itemss);
        }
      });
    } 
        vm.modifierTypeacteur = function (item) { 
      vm.allRecordstype_infrastructure_agr.forEach(function(prg) {
        if(prg.id==item.id_type_acteur) {
          item.typeacteur=[];
          var itemss = {
            id: prg.id,
            description: prg.description,
          };
          item.typeacteur.push(itemss);
        }
      });
      console.log(item.typeacteur);
    }*/ 

 
      
   


    }
  })();
