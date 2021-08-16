(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.composante')
        .controller('ComposanteController', ComposanteController);

    /** @ngInject */
    function ComposanteController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;
            vm.serveur_central = serveur_central ;
    
   

    //composante NEW CODE

      vm.all_composante = [] ;

      vm.composante_column =
      [
        {titre:"code "},
        {titre:"libelle "},
        {titre:"montant prevu"},
        
      ];

      vm.dtOptions_new =
      {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple_numbers',
          retrieve:'true',
          order:[] 
      };

      vm.formatMillier = function (nombre) 
      {
          if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
              nombre += '';
              var sep = ' ';
              var reg = /(\d+)(\d{3})/;
              while (reg.test(nombre)) {
                  nombre = nombre.replace(reg, '$1' + sep + '$2');
              }
              return nombre;
          } else {
              return "";
          }
      }


      vm.affiche_load = false ;

      
        vm.affiche_load = true ;
        apiFactory.getAll("composante_pfss/index").then(function(result){
          vm.all_composante = result.data.response;
          console.log(result.data.response);
          vm.affiche_load = false ;

        });  
      

      //composante..
        
          vm.selected_composante = {} ;
          var current_selected_composante = {} ;
           vm.nouvelle_composante = false ;

        
        vm.selection_composante = function(item)
        {
          vm.selected_composante = item ;

          if (!vm.selected_composante.$edit) //si simple selection
          {
            vm.nouvelle_composante = false ;  

          }
          console.log(vm.selected_composante);

        }

        $scope.$watch('vm.selected_composante', function()
        {
          if (!vm.all_composante) return;
          vm.all_composante.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_composante.$selected = true;

        });

        vm.ajouter_composante = function()
        {
          vm.nouvelle_composante = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      code_composante:'',
                      libelle_composante:'',
                      montant_prevu:''
                      
            } ;

          vm.all_composante.unshift(item);
                vm.all_composante.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_composante = af;
                    
                  }
                });
        }

        vm.modifier_composante = function()
        {
          vm.nouvelle_composante = false ;
          vm.selected_composante.$edit = true;
        
          current_selected_composante = angular.copy(vm.selected_composante);

          vm.selected_composante.montant_prevu = Number( vm.selected_composante.montant_prevu);
        }

        vm.supprimer_composante = function()
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

          vm.enregistrer_composante(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_composante = function()
        {
          if (vm.nouvelle_composante) 
          {
            
            vm.all_composante.shift();
            vm.selected_composante = {} ;
            vm.nouvelle_composante = false ;
          }
          else
          {
            

            if (!vm.selected_composante.$edit) //annuler selection
            {
              vm.selected_composante.$selected = false;
              vm.selected_composante = {};
            }
            else
            {
              vm.selected_composante.$selected = false;
              vm.selected_composante.$edit = false;              
              vm.selected_composante.code_composante = current_selected_composante.code ;
              vm.selected_composante.libelle_composante = current_selected_composante.libelle ;
              vm.selected_composante.montant_prevu = current_selected_composante.montant_prevu 
              
              vm.selected_composante = {};
            }

            

          }
        }

        vm.enregistrer_composante = function(etat_suppression)
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
                    id:vm.selected_composante.id,
                   
                    code : vm.selected_composante.code ,
                    libelle : vm.selected_composante.libelle ,
                    montant_prevu : vm.selected_composante.montant_prevu 

                    
                    
                });
                console.log(datas);
                console.log( vm.selected_composante);

                apiFactory.add("composante_pfss/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_composante) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_composante.$edit = false ;
                    vm.selected_composante.$selected = false ;
                    vm.selected_composante = {} ;
                  }
                  else
                  {
                    vm.all_composante = vm.all_composante.filter(function(obj)
                {
                  return obj.id !== vm.selected_composante.id;
                });

                vm.selected_composante = {} ;
                  }

                }
                else
                {
                  vm.selected_composante.$edit = false ;
                  vm.selected_composante.$selected = false ;
                  vm.selected_composante.id = String(data.response) ;

                  vm.nouvelle_composante = false ;
                  vm.selected_composante = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }

      

      //fin composante..
    //FIN composante NEW CODE   
    
 

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
      vm.allRecordscomposante.forEach(function(prg) {
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
