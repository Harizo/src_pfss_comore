(function ()
{
    'use strict';

    angular
        .module('app.pfss.gestion_financiere')
        .controller('gestion_financiereController', gestion_financiereController);

    /** @ngInject */
    function gestion_financiereController(apiFactory, $scope, $mdDialog, $location)
    {
    	var vm = this ;



    	vm.all_gestion_financiere = [] ;
    	vm.selected_gestion_financiere = {};

    	vm.date_now = new Date();

    	apiFactory.getAll("ile").then(function(result)
        {
            vm.all_ile = result.data.response;
        });

        apiFactory.getAll("region").then(function(result)
        {
            vm.all_regions = result.data.response;
           

            
        });

        apiFactory.getAll("commune").then(function(result)
        {
            vm.all_communes = result.data.response;
            


        });

        apiFactory.getAll("village").then(function(result)
        {
            vm.all_villages = result.data.response;
            

        });



        apiFactory.getAll("sous_projet").then(function(result)
        {
            vm.all_sous_projet = result.data.response;

        });

        vm.gestion_financiere = {};

  
        	$scope.$watch('vm.gestion_financiere.id_ile', function() 
        	{
                if (!vm.gestion_financiere.id_ile) return;
                else
                {

                	vm.all_commune = [];
                	vm.all_village = [];

                

                	vm.all_region = vm.all_regions;
                	vm.all_region = vm.all_region.filter(function (obj)
		        	{
		        		return obj.ile.id == vm.gestion_financiere.id_ile ;
		        	})
		        }
                
            })

            $scope.$watch('vm.gestion_financiere.id_region', function() 
        	{
                if (!vm.gestion_financiere.id_region) return;
                else
                {
                	vm.all_village = [];


             

                	vm.all_commune = vm.all_communes;
                	vm.all_commune = vm.all_commune.filter(function (obj)
		        	{
		        		return obj.prefecture.id == vm.gestion_financiere.id_region ;
		        	})
		        }
                
            })

            $scope.$watch('vm.gestion_financiere.id_commune', function() 
        	{
                if (!vm.gestion_financiere.id_ile) return;
                else
                {
                	
                	vm.all_village = vm.all_villages;
                	vm.all_village = vm.all_village.filter(function (obj)
		        	{
		        		return obj.commune.id == vm.gestion_financiere.id_commune ;
		        	})
		        }
                
            })

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
                    return nombre;
                }
            }

            vm.replace_point = function(nbr)
            {
                

                if (nbr) 
                {
                    var str = ""+nbr ;
                    var res = str.replace(".",",") ;
                    return res ;
                }
                else
                    return nbr;
            }

        //gestion_financiere
            vm.affichage_masque_filtre = false ;
            vm.affichage_masque = false ;
            var nouvelle_gestion_financiere = false ;
            vm.gestion_financiere = {};
            vm.filtre = {};
             

            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };

            vm.entete_gestion_financiere = 
            [
                {titre:"Date"},
                {titre:"Composante"},
                {titre:"Activité"},
                {titre:"Ile"},
                {titre:"Préfecture"},
                {titre:"Commune"},
                {titre:"Village"},
                {titre:"Montant engagé"},
                {titre:"Montant payé"}
            ];
           
            


            vm.get_suivi_budgetaire = function (data_filtre) 
            {
                apiFactory.getParamsDynamic("gestion_financiere/index?date_debut="+convert_to_date_sql(data_filtre.date_debut)+"&date_fin="+convert_to_date_sql(data_filtre.date_fin)).then(function(result)
                {
                    vm.all_gestion_financiere = result.data.response;
                });
            }

            vm.open_masque_filtre = function () 
            {
                vm.affichage_masque_filtre = true ;
                vm.filtre.date_fin = vm.date_now ;
            }

            vm.fermer_masque_filtre = function () 
            {
                vm.affichage_masque_filtre = false ;
            }



            function convert_to_date_sql(date)
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

       

            vm.selection = function (item) 
            {
                vm.selected_gestion_financiere = item ;
        
              
            }

            $scope.$watch('vm.selected_gestion_financiere', function() {
                if (!vm.all_gestion_financiere) return;
                vm.all_gestion_financiere.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selected_gestion_financiere.$selected = true;
            })

            vm.ajout_gestion_financiere = function () 
            {
                vm.affichage_masque = true ;
                
                nouvelle_gestion_financiere = true;

                vm.gestion_financiere = {};

            }

            vm.annuler = function () {
               vm.affichage_masque = false ;
                
                nouvelle_gestion_financiere = false;

                vm.selected_gestion_financiere = {};
            }

            vm.modif_gestion_financiere = function () 
            {
                vm.affichage_masque = true ;
                nouvelle_gestion_financiere = false;

                vm.gestion_financiere.date = new Date(vm.selected_gestion_financiere.date) ;

                vm.gestion_financiere.id_composante = vm.selected_gestion_financiere.id_composante ;

                vm.gestion_financiere.id_sous_projet = vm.selected_gestion_financiere.id_sous_projet ;

                vm.gestion_financiere.id_ile = vm.selected_gestion_financiere.id_ile ;
                vm.gestion_financiere.id_region = vm.selected_gestion_financiere.id_region ;
                vm.gestion_financiere.id_commune = vm.selected_gestion_financiere.id_commune ;
                vm.gestion_financiere.id_village = vm.selected_gestion_financiere.id_village ;

                vm.gestion_financiere.montant_engage = Number(vm.selected_gestion_financiere.montant_engage) ;

                vm.gestion_financiere.montant_paye = Number(vm.selected_gestion_financiere.montant_paye) ;
            }

            vm.supprimer_gestion_financiere = function()
            {
                vm.affichage_masque_societe_crevette = false ;
                
                var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('ok')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {

                vm.save_in_bdd(vm.selected_gestion_financiere,1);
                }, function() {
                //alert('rien');
                });
            }

            vm.save_in_bdd = function(data_masque, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;

                    if (!nouvelle_gestion_financiere) 
                    {
                        id = vm.selected_gestion_financiere.id ;
                    }

                 


                   

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,

                        date : convert_to_date_sql(data_masque.date) ,
                        id_composante : data_masque.id_composante ,
                        id_sous_projet : data_masque.id_sous_projet ,
                        id_village : data_masque.id_village ,
                        montant_engage : data_masque.montant_engage ,
                        montant_paye : data_masque.montant_paye 
                        
                    });

                    apiFactory.add("gestion_financiere/index",datas, config).success(function (data)
                    {

                    	var sp = vm.all_sous_projet.filter(function (obj) 
                    	{
                    		return obj.id == data_masque.id_sous_projet ;
                    	})

                    	var v = vm.all_village.filter(function (obj) 
                    	{
                    		return obj.id == data_masque.id_village ;
                    	})

                    	var c = vm.all_commune.filter(function (obj) 
                    	{
                    		return obj.id == data_masque.id_commune ;
                    	})

                    	var r = vm.all_region.filter(function (obj) 
                    	{
                    		return obj.id == data_masque.id_region ;
                    	})

                    	var i = vm.all_ile.filter(function (obj) 
                    	{
                    		return obj.id == data_masque.id_ile ;
                    	})
                       

                        if (!nouvelle_gestion_financiere) 
                        {
                            if (etat_suppression == 0) 
                            {

                                vm.selected_gestion_financiere.date = convert_to_date_sql(data_masque.date) ;
                                vm.selected_gestion_financiere.id_composante = data_masque.id_composante ;

                                vm.selected_gestion_financiere.id_sous_projet = data_masque.id_sous_projet ;
                                vm.selected_gestion_financiere.code_sous_projet = sp[0].code ;

                                vm.selected_gestion_financiere.id_village = data_masque.id_village ;
                                vm.selected_gestion_financiere.Village = v[0].Village ;

                                vm.selected_gestion_financiere.id_commune = data_masque.id_commune ;
                                vm.selected_gestion_financiere.Commune = c[0].Commune ;

                                vm.selected_gestion_financiere.id_region = data_masque.id_region ;
                                vm.selected_gestion_financiere.Region = r[0].Region ;

                                vm.selected_gestion_financiere.id_ile = data_masque.id_ile ;
                                vm.selected_gestion_financiere.Ile = i[0].Ile ;


                                vm.selected_gestion_financiere.montant_engage = data_masque.montant_engage ;
                                vm.selected_gestion_financiere.montant_paye = data_masque.montant_paye ;
                                
                                
                            }
                            else
                            {
                                vm.all_gestion_financiere = vm.all_gestion_financiere.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_gestion_financiere.id ;
                                });
                            }

                        }
                        else
                        {
                            var item = {
                                id:String(data.response) ,

                             

                                date : (data_masque.date) ,
                                id_composante : data_masque.id_composante ,

                                id_sous_projet : data_masque.id_sous_projet ,
                                code_sous_projet : sp[0].code,

                                id_village : data_masque.id_village ,
                                Village : v[0].Village ,

                                id_commune : data_masque.id_commune ,
                                Commune : c[0].Commune ,

                                id_region : data_masque.id_region ,
                                Region : r[0].Region ,

                                id_ile : data_masque.id_ile ,
                                Ile : i[0].Ile ,

                                montant_engage : data_masque.montant_engage ,
                                montant_paye : data_masque.montant_paye
                            }

                         

                            vm.all_gestion_financiere.unshift(item) ;
                        }
                        nouvelle_gestion_financiere = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //gestion_financiere

        //REPORTING

            vm.filtre_etat = {};
            $scope.$watch('vm.filtre_etat.id_ile', function() 
            {
                if (!vm.filtre_etat.id_ile) return;
                else
                {

                    vm.all_commune = [];
                    vm.all_village = [];

                

                    vm.all_region = vm.all_regions;
                    vm.all_region = vm.all_region.filter(function (obj)
                    {
                        return obj.ile.id == vm.filtre_etat.id_ile ;
                    })
                }
                
            })

            $scope.$watch('vm.filtre_etat.id_region', function() 
            {
                if (!vm.filtre_etat.id_region) return;
                else
                {
                    vm.all_village = [];


             

                    vm.all_commune = vm.all_communes;
                    vm.all_commune = vm.all_commune.filter(function (obj)
                    {
                        return obj.prefecture.id == vm.filtre_etat.id_region ;
                    })
                }
                
            })

            $scope.$watch('vm.filtre_etat.id_commune', function() 
            {
                if (!vm.filtre_etat.id_ile) return;
                else
                {
                    
                    vm.all_village = vm.all_villages;
                    vm.all_village = vm.all_village.filter(function (obj)
                    {
                        return obj.commune.id == vm.filtre_etat.id_commune ;
                    })
                }
                
            })
            
            vm.pivots = 
            [
        
                {titre:"Situation par composante", id:"situtation_composante"},
                {titre:"Situation par activité", id:"situtation_activite"}
        
            ];


            vm.get_etat = function(data_masque, etat_export_excel)
            {

                vm.affiche_load = true ;

             
                var etat_choisis = vm.pivots.filter(function(obj)
                {
                    return obj.id == data_masque.pivot ;
                });

                var repertoire = "gestion_budgetaire/";

                apiFactory.getParamsDynamic("Gestion_financiere/index?etat_sortie=true"+
                    "&etat_export_excel="+etat_export_excel+
                    "&repertoire="+repertoire+
                    "&etat_choisis="+data_masque.pivot+
                    "&id_village="+data_masque.id_village+
                    "&date_debut="+convert_to_date_sql(data_masque.date_debut)+
                    "&date_fin="+convert_to_date_sql(data_masque.date_fin)+
                    "&titre_etat="+etat_choisis[0].titre).then(function(result)
                {

                    

                    if (etat_export_excel == 1) 
                    {
                        var nom_file = result.data.nom_file;
                        vm.affiche_load = false ;
                        window.location = apiUrlExportexcel+repertoire+nom_file ;
                    }
                    else
                    {
                        vm.affiche_load = false ;
                        vm.reporting = result.data.response;
                        
                            
                        vm.entete_etat = Object.keys(vm.reporting[0]).map(function(cle) {
                            return (cle);
                        });
                    }

                        
                });
            }
        //FIN REPORTING

    }
})();