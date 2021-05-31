(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.phase_execution')
        .controller('phase_executionController', phase_executionController);

    /** @ngInject */
    function phase_executionController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;
      vm.serveur_central = serveur_central ; 
      vm.selected_phase_execution = {} ;
      var current_selected_phase_execution = {} ;
      vm.nouvelle_phase_execution = false ;
      vm.all_phase_execution = [] ;
      vm.affiche_load = true ;

     vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      responsive: true,
      order:[]          
    };       
    
   

    //phase_execution NEW CODE


      vm.phase_execution_column =
      [ 
        {titre:"Sous projet"},
        {titre:"Code "},
        {titre:"Tranche "},
        {titre:"Montant"},
        {titre:"Pourcentage"}
        
      ];
      apiFactory.getAll("sous_projet/index").then(function(result)
      {
        vm.allSous_projet= result.data.response; 
        console.log(vm.allSous_projet);       
      }); 
        apiFactory.getAll("phaseexecution/index").then(function(result)
        {
          vm.all_phase_execution = result.data.response;
          
          apiFactory.getAll("annee/index").then(function(result)
          {
            vm.all_annee = result.data.response;
            vm.affiche_load = false ;
  
          });

        });  
      

      //phase_execution..

        
        vm.selection_phase_execution = function(item)
        {
          vm.selected_phase_execution = item ;

          if (!vm.selected_phase_execution.$edit) //si simple selection
          {
            vm.nouvelle_phase_execution = false ;  

          }
        }

        $scope.$watch('vm.selected_phase_execution', function()
        {
          if (!vm.all_phase_execution) return;
          vm.all_phase_execution.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_phase_execution.$selected = true;

        });

        vm.ajouter_phase_execution = function()
        {
          vm.nouvelle_phase_execution = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      id_sous_projet:'',                     
                      Code:'',
                      Phase:'',
                      indemnite:'',
                      pourcentage:''
                      
            } ;

          vm.all_phase_execution.unshift(item);
                vm.all_phase_execution.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_phase_execution = af;
                    
                  }
                });
        }
        vm.modifier_phase_execution = function()
        {
          vm.nouvelle_phase_execution = false ;
          vm.selected_phase_execution.$edit = true;
          vm.selected_phase_execution.id_sous_projet = vm.selected_phase_execution.sous_projet.id;
          vm.selected_phase_execution.Code = vm.selected_phase_execution.Code;
          vm.selected_phase_execution.Phase = vm.selected_phase_execution.Phase;
          vm.selected_phase_execution.indemnite = parseFloat(vm.selected_phase_execution.indemnite);
          vm.selected_phase_execution.pourcentage = parseFloat(vm.selected_phase_execution.pourcentage);
        
          current_selected_phase_execution = angular.copy(vm.selected_phase_execution);
        }

        vm.supprimer_phase_execution = function()
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

          vm.enregistrer_phase_execution(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_phase_execution = function()
        {
          if (vm.nouvelle_phase_execution) 
          {
            vm.all_phase_execution.shift();
            vm.selected_phase_execution = {} ;
            vm.nouvelle_phase_execution = false ;
          }
          else
          {
            

            if (!vm.selected_phase_execution.$edit) //annuler selection
            {
              vm.selected_phase_execution.$selected = false;
              vm.selected_phase_execution = {};
            }
            else
            {
              vm.selected_phase_execution.$selected = false;
              vm.selected_phase_execution.$edit = false;   
              vm.selected_phase_execution.id_sous_projet = current_selected_phase_execution.sous_projet.id ;           
              vm.selected_phase_execution.Code = current_selected_phase_execution.Code ;
              vm.selected_phase_execution.Phase = current_selected_phase_execution.Phase ;
              vm.selected_phase_execution.indemnite = current_selected_phase_execution.indemnite ;
              vm.selected_phase_execution.pourcentage = current_selected_phase_execution.pourcentage ;             
              vm.selected_phase_execution = {};
            }

            console.log(vm.selected_phase_execution)

          }
        }

        vm.enregistrer_phase_execution = function(etat_suppression)
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
                    id:vm.selected_phase_execution.id,
                    id_sous_projet : vm.selected_phase_execution.id_sous_projet ,
                    Code : vm.selected_phase_execution.Code ,
                    Phase : vm.selected_phase_execution.Phase ,
                    indemnite : vm.selected_phase_execution.indemnite ,
                    pourcentage : vm.selected_phase_execution.pourcentage                     
                    
                });

                apiFactory.add("phaseexecution/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_phase_execution) 
                {
                  if (etat_suppression == 0) 
                  { 
                    var sp = vm.allSous_projet.filter(function(obj)
                    {
                      return obj.id == vm.selected_phase_execution.id_sous_projet;
                    });
                    vm.selected_phase_execution.sous_projet = sp[0] ;
                    vm.selected_phase_execution.$edit = false ;
                    vm.selected_phase_execution.$selected = false ; 
                    vm.selected_phase_execution = {} ;
                  }
                  else
                  {
                    vm.all_phase_execution = vm.all_phase_execution.filter(function(obj)
                    {
                      return obj.id !== vm.selected_phase_execution.id;
                    });

                    vm.selected_phase_execution = {} ;
                  }

                }
                else
                { 
                  
                  var sp = vm.allSous_projet.filter(function(obj)
                  {
                    return obj.id == vm.selected_phase_execution.id_sous_projet;
                  });
                  vm.selected_phase_execution.sous_projet = sp[0] ;
                  vm.selected_phase_execution.$edit = false ;
                  vm.selected_phase_execution.$selected = false ;
                  vm.selected_phase_execution.id = String(data.response) ;

                  vm.nouvelle_phase_execution = false ;
                  vm.selected_phase_execution = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }

vm.formatDate = function (daty)
{
  if (daty) 
  {
    var date  = new Date(daty);
    var annee = date.getFullYear()
    var mois  = date.getMonth()+1;
    var date = (date.getDate()+"-"+mois+"-"+date.getFullYear());
    return date;
  }   
  
           

}

      //fin phase_execution..
    //FIN phase_execution NEW CODE     
        
    //annee NEW CODE
      vm.annee_column =
      [
        {titre:"annee "},
        
        
      ];         
      

      //annee
        
          vm.selected_annee = {} ;
          var current_selected_annee = {} ;
           vm.nouvelle_annee = false ;

        
        vm.selection_annee= function(item)
        {
          vm.selected_annee = item ;

          if (!vm.selected_annee.$edit) //si simple selection
          {
            vm.nouvelle_annee = false ;  

          }
          console.log(vm.selected_annee);

        }

        $scope.$watch('vm.selected_annee', function()
        {
          if (!vm.all_annee) return;
          vm.all_annee.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_annee.$selected = true;

        });

        vm.ajouter_annee = function()
        {
          vm.nouvelle_annee = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      annee:'',
                      
            } ;

          vm.all_annee.unshift(item);
          vm.all_annee.forEach(function(af)
          {
            if(af.$selected == true)
            {
              vm.selected_annee = af;                    
            }
          });
        }

        vm.modifier_annee = function()
        {
          vm.nouvelle_annee = false ;
          vm.selected_annee.$edit = true;
          vm.selected_annee.annee = vm.selected_annee.annee;                  
          current_selected_annee = angular.copy(vm.selected_annee);
        }

        vm.supprimer_annee = function()
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

          vm.enregistrer_annee(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_annee = function()
        {
          if (vm.nouvelle_annee) 
          {
            
            vm.all_annee.shift();
            vm.selected_annee= {} ;
            vm.nouvelle_annee = false ;
          }
          else
          {
            

            if (!vm.selected_annee.$edit) //annuler selection
            {
              vm.selected_annee.$selected = false;
              vm.selected_annee = {};
            }
            else
            {
              vm.selected_annee.$selected = false;
              vm.selected_annee.$edit = false;              
              vm.selected_annee.annee = current_selected_annee.annee ;                        
              vm.selected_annee = {};
            }

            console.log(vm.selected_annee)

          }
        }

        vm.enregistrer_annee = function(etat_suppression)
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
                    id: vm.selected_annee.id,
                    annee : vm.selected_annee.annee ,
                });
                apiFactory.add("annee/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_annee) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_annee.$edit = false ;
                    vm.selected_annee.$selected = false ; 
                    vm.selected_annee = {} ;
                  }
                  else
                  {
                    vm.all_annee= vm.all_annee.filter(function(obj)
                {
                  return obj.id !== vm.selected_annee.id;
                });

                vm.selected_annee = {} ;
                  }

                }
                else
                {
                  vm.selected_annee.$edit = false ;
                  vm.selected_annee.$selected = false ;
                  vm.selected_annee.id = String(data.response) ;

                  vm.nouvelle_annee = false ;
                  vm.selected_annee = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }



    }
  })();
