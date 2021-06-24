(function ()
{
    'use strict';

    angular
        .module('app.pfss.planning_ebe')
        .controller('Planning_ebeController', Planning_ebeController);

    /** @ngInject */
    function Planning_ebeController(apiFactory, $scope, $mdDialog,$state)
    {
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
    	vm.selectedItemPlanning_ebe = {};
		var NouvelItemPlanning_ebe=false;
        var currentItemPlanning_ebe;

        vm.allPlanning_ebe = [];
        vm.affiche_load = false ;

        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };


        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
        });
        
        apiFactory.getAll("theme_sensibilisation/index").then(function(result)
        {
            vm.allTheme_sensibilisation = result.data.response;
        });

        vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ;  
          vm.filtre.id_village = null ;  
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ; 
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.id_village = null ; 
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ;         
        });
      }
      
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;  
          vm.filtre.id_zip = null ; 
          vm.filtre.vague = null ;           
        });
      }
      vm.filtre_zip_groupe = function()
        {
          vm.allZip=[];
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == vm.filtre.id_village;
          });
		  if (vil.length!=0)
		  {
			  if (vil[0].vague)
			  {
				vm.filtre.vague = vil[0].vague;
			  }
			  else
			  {
				vm.filtre.vague = null ; 
			  }
			  if (vil[0].zip)
			  {
				apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
					vm.allZip.push(result.data.response);
					
					if (result.data.response)
					{
					  vm.filtre.id_zip = result.data.response.id;
					}
					else
					{
						vm.filtre.id_zip = null;
					}
					
				  });
			  }
			  else
			  {
				vm.filtre.id_zip = null ; 
			  }

		  }
		  else
		  {
			vm.filtre.id_zip = null;
			vm.filtre.vague = null ; 
		  }
            apiFactory.getAPIgeneraliserREST("planning_ebe/index","menu","getgroupeByvillagewithnbr_membre","id_village",vm.filtre.id_village).then(function(result)
            { 
                vm.allGroupe_ml_pl = result.data.response;  
               // console.log()          
            });
          
        }
        
      
      vm.get_planning_ebe = function()
      {
          apiFactory.getAPIgeneraliserREST("planning_ebe/index","menu","getplanning_ebeByvillage",
          "id_village",vm.filtre.id_village).then(function(result) { 
              vm.allPlanning_ebe = result.data.response;
              console.log(vm.allPlanning_ebe);
          });           
          vm.selectedItemPlanning_ebe ={};
      }
            vm.planning_ebe_column = 
            [   
                {titre:"Numero"},
                {titre:"Nom du Groupe"},
                {titre:"Date EBE"},
                {titre:"Durée"},
                {titre:"Lieux"},
                {titre:"Théme à discuter"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemPlanning_ebe = item ;
                console.log(vm.selectedItemPlanning_ebe);
            }

            $scope.$watch('vm.selectedItemPlanning_ebe', function() {
                if (!vm.allPlanning_ebe) return;
                vm.allPlanning_ebe.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemPlanning_ebe.$selected = true;
            });

            vm.ajoutPlanning_ebe = function(planning_ebe,suppression)
            {
                if (NouvelItemPlanning_ebe==false)
                {
                    test_existencePlanning_ebe(planning_ebe,suppression); 
                }
                else
                {
                    insert_in_basePlanning_ebe(planning_ebe,suppression);
                }
            }
            vm.ajouterPlanning_ebe = function ()
            {
                vm.selectedItemPlanning_ebe.$selected = false;
                NouvelItemPlanning_ebe = true ;
                vm.planning_ebe.supprimer=0;
                vm.planning_ebe.id=0;
                vm.planning_ebe.numero=null;
                vm.planning_ebe.id_groupe_ml_pl= null;
                vm.planning_ebe.date_ebe=null;
                vm.planning_ebe.duree=null;
                vm.planning_ebe.lieu=null;
                vm.planning_ebe.materiel=null;
                vm.planning_ebe.lieu=null;
                vm.planning_ebe.id_theme_sensibilisation=null;		
                vm.affichage_masque=true;
                vm.selectedItemPlanning_ebe = {};
            }
            vm.annulerPlanning_ebe = function(item)
            {
                vm.selectedItemPlanning_ebe={};
                vm.selectedItemPlanning_ebe.$selected = false;
                NouvelItemPlanning_ebe = false;
                vm.affichage_masque=false;
                vm.planning_ebe = {};
            };

            vm.modifPlanning_ebe = function () 
            {
                NouvelItemPlanning_ebe = false;                
                currentItemPlanning_ebe = JSON.parse(JSON.stringify(vm.selectedItemPlanning_ebe));
                vm.planning_ebe.numero  = parseInt(vm.selectedItemPlanning_ebe.numero) ;
                vm.planning_ebe.id_groupe_ml_pl  = vm.selectedItemPlanning_ebe.groupe_ml_pl.id ;
                vm.planning_ebe.date_ebe   = new Date(vm.selectedItemPlanning_ebe.date_ebe) 
                vm.planning_ebe.duree = parseFloat(vm.selectedItemPlanning_ebe.duree);
                vm.planning_ebe.lieu = vm.selectedItemPlanning_ebe.lieu ;
                vm.planning_ebe.id_theme_sensibilisation  = vm.selectedItemPlanning_ebe.theme_sensibilisation.id ;
                vm.affichage_masque=true;
            }

            vm.supprimerPlanning_ebe = function()
            {
                vm.affichage_masque = false ;
                
                var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('ok')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {

                    insert_in_basePlanning_ebe(vm.selectedItemPlanning_ebe,1);
                }, function() {
                });
            }

            function insert_in_basePlanning_ebe (planning_ebe, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    var id_villa = vm.filtre.id_village
                    if (!NouvelItemPlanning_ebe) 
                    {
                        id = vm.selectedItemPlanning_ebe.id ;
                        id_villa = vm.selectedItemPlanning_ebe.id_village;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,
                        numero:             planning_ebe.numero,
                        id_groupe_ml_pl:    planning_ebe.id_groupe_ml_pl,
                        date_ebe:           convert_date(planning_ebe.date_ebe),
                        duree:              planning_ebe.duree,
                        lieu:               planning_ebe.lieu,
                        id_theme_sensibilisation:  planning_ebe.id_theme_sensibilisation ,
                        id_village:  id_villa          
                        
                    });

                    apiFactory.add("planning_ebe/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemPlanning_ebe) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var group = vm.allGroupe_ml_pl.filter(function(obj)
                                {
                                    return obj.id == planning_ebe.id_groupe_ml_pl  ;
                                });             
                                
                                var them = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == planning_ebe.id_theme_sensibilisation  ;
                                });
                                vm.selectedItemPlanning_ebe.theme_sensibilisation = them[0] ;                   
                                vm.selectedItemPlanning_ebe.groupe_ml_pl = group[0] ;
                                vm.selectedItemPlanning_ebe.numero           = planning_ebe.numero ;
                                vm.selectedItemPlanning_ebe.date_ebe = new Date(planning_ebe.date_ebe) ;
                                vm.selectedItemPlanning_ebe.duree = planning_ebe.duree ;
                                vm.selectedItemPlanning_ebe.lieu         = planning_ebe.lieu ;                             
                            }
                            else
                            {
                                vm.allPlanning_ebe = vm.allPlanning_ebe.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemPlanning_ebe.id ;
                                });
                            }

                        }
                        else
                        {   
                            var group = vm.allGroupe_ml_pl.filter(function(obj)
                                {
                                    return obj.id == planning_ebe.id_groupe_ml_pl  ;
                                });             
                                
                                var them = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == planning_ebe.id_theme_sensibilisation  ;
                                });
                               // vm.selectedItemPlanning_ebe.theme_sensibilisation = them[0] ;                   
                               // vm.selectedItemPlanning_ebe.groupe_ml_pl = group[0] ;
                            var item =
                            {
                            id :    String(data.response) ,
                            groupe_ml_pl :    group[0] ,
                            theme_sensibilisation :    them[0] ,
                            numero :        planning_ebe.numero ,
                            date_ebe :      new Date(planning_ebe.date_ebe) ,
                            duree :         planning_ebe.duree ,
                            lieu :          planning_ebe.lieu ,
                            id_village :    id_villa 
                            }
                            vm.allPlanning_ebe.unshift(item) ;
					        
                        }
                        NouvelItemPlanning_ebe = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.planning_ebe = {};
                        vm.selectedItemPlanning_ebe ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existencePlanning_ebe (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemPlanning_ebe.numero             != item.numero )
                        ||(currentItemPlanning_ebe.groupe_ml_pl.id != item.id_groupe_ml_pl )
                        ||(currentItemPlanning_ebe.date_ebe   != convert_date(item.date_ebe) )
                        ||(currentItemPlanning_ebe.duree      != item.duree )
                        ||(currentItemPlanning_ebe.lieu       != item.lieu )
                        ||(currentItemPlanning_ebe.theme_sensibilisation.id   != item.id_theme_sensibilisation)
                        )                    
                    { 
                            insert_in_basePlanning_ebe(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_basePlanning_ebe(item,suppression);		
            }
        //Planning ebe fin

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

            function convert_date(date)
            {   
                if(date)
                {
                    var d     = new Date(date);
                    var jour  = d.getDate();
                    var mois  = d.getMonth()+1;
                    var annee = d.getFullYear();
                    if(mois <10)
                    {
                        mois = '0' + mois;
                    }
                    if(jour <10)
                    {
                        jour = '0' + jour;
                    }
                    var date_final= annee+"-"+mois+"-"+jour;
                    return date_final
                }      
            }
            vm.formatDate = function (daty)
            {
                if (daty) 
                {
                    var date  = new Date(daty);
                    var mois  = date.getMonth()+1;
                    var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
                    return dates;
                }            

            }
        
    }
})();
