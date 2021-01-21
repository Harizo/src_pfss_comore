(function ()
{
    'use strict';

    angular
        .module('app.population.reporting.environment_et_systeme')
        .controller('Environment_et_systemeController', Environment_et_systemeController);

    /** @ngInject */
    function Environment_et_systemeController($scope, $mdDialog, apiFactory,$state, apiUrlExcel)
    {
        /*********DEBUT INITIALISATION *********/
            var vm = this;
                vm.isDistrict = false;
                vm.isCommune  = false;
                vm.affiche_load = false ;
                vm.effectif_age_sexe = [];
                
                vm.filtre      = {};
                vm.alldistrict = [];
                vm.allcommune  = [];
                vm.allregion   = [];

        /*********DEBUT ONGLET EFFECTIF AGE SEXE*********/

        //style datatable
        vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: true,
            responsive: false
        };

        //Tableau ded bord dg
          vm.affiche_load = true ;
          apiFactory.getAPIgeneraliserREST("Environment_et_systeme/index",
                                              "menu","tableu_bord_dg")//fin code harizo
            .then(function(result)
            {

              
                  vm.datas_dg = result.data.response;
                  vm.affiche_load = false ;
                  console.log(vm.datas_dg);
             
        
            });
        //Fin Tableau ded bord dg

        vm.pivots = [
          
         /* {
            titre:"* Nombre cumulé bénéficiaire_33",
            id:"req33theme2_interven_nbrbenef_region_dist_comm",
            category:"theme2"

          }
          //DEBUT CODE HARIZO
          ,*/
          {
            titre:"Effectif des bénéficiaires handicapés",
            id:"req40_theme2",
            category:"theme2"
          },
          {
            titre:"Effectif des bénéficiaires sortis du programme",
            id:"req41_theme2",
            category:"theme2"
          },
          {
            titre:"Moyenne des transferts",
            id:"req42_theme2",
            category:"theme2"
          },
          {
            titre:"Total des transferts",
            id:"req43_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition décaissement par programme",
            id:"req10_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition décaissement par tutelle",
            id:"req11_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition des agences d'exécution par programme",
            id:"req12_theme2",
            category:"theme2"
          },
          {
            titre:"Montant du budget non consommé",
            id:"req37_theme2",
            category:"theme2"
          },
          {
            titre:"Taux de décaissement par intervention",
            id:"req36_theme2",
            category:"theme2"
          },
          {
            titre:"Proportion des interventions par type de cible",
            id:"req18_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition géographique des interventions",
            id:"req14_theme2",
            category:"theme2"
          },
          {
            titre:"Proportion des interventions avec critères de sexe",
            id:"req20_theme2",
            category:"theme2"
          },
          {
            titre:"Proportion des interventions avec critères d'âge",
            id:"req19_theme2",
            category:"theme2"
          },
          {
            titre:"Nombre de nouveaux bénéficiaires",
            id:"req32_theme2",
            category:"theme2"
          },
          {
            titre:"Taux d’atteinte des résultats",
            id:"req34_theme2",
            category:"theme2"
          },
          ,
          {
            titre:"Cible de l'intervention",
            id:"req_multiple_21_to_30_theme2",
            category:"theme2"
          },
          {
            titre:"Indice de niveau de vulnérabilité",
            id:"req6_theme2",
            category:"theme2"
          }/*,

          {
            titre:"Listes bénéficiaires",
            id:"liste_beneficiaire_intevention",
            category:"theme1"
          }*/, 

          //FIN CODE HARIZO    

          //code modifier par harizo
          { 
            titre:"Effectif par age sexe de la population",
            id:"req1_theme1",
            category:"theme1"
          },
          { 
            titre:"Effectif menage ayant enfant",
            id:"req3_theme1",
            category:"theme1"
          },
          { 
            titre:"Répartition par âge et par sexe des bénéficiaires",
            id:"req38_theme2",
            category:"theme2"
          }
          ,
          {
            titre:"Répartition financement par programme",
            id:"req7_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition financement par source",
            id:"req8_theme2",
            category:"theme2"
          },
          {
            titre:"Répartition financement par tutele",
            id:"req9_theme2",
            category:"theme2"
          }    
          //code modifier par harizo   
          
          //Debut Bruce
          ,
          /*{
            titre:"* Nombre des bénéficiaires prévus_31",
            id:"req31theme2_interven_nbrinter_program_beneparan_beneprevu_region",
            category:"theme2"
          }*//*,
          {
            titre:"Proportion des interventions avec critères d'âge",
            id:"req19theme2_interven_pourcenenfan_pourcensco_pourcentra_pourcenage_pcout",
            category:"theme2"
          }*/    
          //Fin Bruce
        
        ];




        //  harizo
        vm.couleur = function(val1, val2)
        {
        
          if ( (val1 >0) || (val2 > 0) ) 
          {
            
            return "#b7b7b7" ;
          }
        }
        vm.parse_int = function(str)
        {
          return Number(str) ;
        }
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

        vm.replace_point = function(nbr)
        {
          var str = ""+nbr ;
          var res = str.replace(".",",") ;
          return res ;
        }

        vm.parseFloat_0 = function(int)
        {
          var float = parseFloat(int);
          var x = vm.replace_point(float.toFixed(3)) ;
          return x ;
        }

        //affichage situtation programme Req7_theme2
          vm.affichage_situation = function(item)
          {
            if (item.etat_nouveau > 0) 
            {
              return "Nouveau" ;
            }
            else
            {
              return "En cours" ;
            }
          }

          vm.affichage_budget_initial = function(item)
          {
            if (item.etat_nouveau > 0) 
            {
              return item.budget_initial_nouveau ;
            }
            else
            {
              return item.budget_initial_en_cours ;
            }
          }

          vm.affichage_budget_modifie = function(item)
          {
            if (item.etat_nouveau > 0) 
            {
              return item.budget_modifie_nouveau ;
            }
            else
            {
              return item.budget_modifie_en_cours ;
            }
          }
        //fin affichage situtation programme Req7_theme2
        // fin code harizo

        vm.max_date = new Date();

        vm.filtre.date_fin = vm.max_date ;

        //recuperation region
        apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response;    
        });


        apiFactory.getAll("type_transfert/index").then(function(result)
        {
            vm.alltype_transfert = result.data.response;    
        });

        function convertionDate(date)
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
                var date_final= annee+"-"+mois+"-"+jour;
                return date_final
            }      
        }

        //recuperation intervention
        apiFactory.getAll("intervention/index").then(function(result)
        {
            vm.allintervention = result.data.response;    
        });


        
        vm.filtrer = function(filtre)
        {   
            //var date_d= moment(filtre.date_debut).format('YYYY-MM-DD');
            vm.affiche_load = true ;

            apiFactory.getAPIgeneraliserREST("Environment_et_systeme/index",
                                              "menu",filtre.pivot,
                                              "id_region",filtre.region_id,
                                              "id_district",filtre.district_id,
                                              "id_commune",filtre.commune_id,
                                              "id_intervention",filtre.intervention_id,
                                              "id_type_transfert",filtre.id_type_transfert,//code harizo
                                              "date_debut",convertionDate(filtre.date_debut),
                                              "date_fin",convertionDate(filtre.date_fin))//fin code harizo
            .then(function(result)
            {

              
                  vm.datas = result.data.response;
                  vm.affiche_load = false ;
                  console.log(vm.datas);
             
        
            });

          }

          vm.export_excel = function(filtre)
          {
            if (vm.filtre.pivot != "liste_beneficiaire_intevention") 
            {
              vm.affiche_load = true ;

              var repertoire = "tableau_de_bord/" ;

              var piv = vm.pivots.filter(function(obj) {
                return obj.id == vm.filtre.pivot;
              });

              apiFactory.getAPIgeneraliserREST("Export_excel/index",
                                                "menu",vm.filtre.pivot,
                                                "id_region",filtre.region_id,
                                                /*"id_district",filtre.district_id,
                                                "id_commune",filtre.commune_id,
                                                "id_intervention",filtre.intervention_id,*/
                                                "id_type_transfert",filtre.id_type_transfert,
                                                "date_debut",convertionDate(filtre.date_debut),
                                                "date_fin",convertionDate(filtre.date_fin),
                                                "repertoire",repertoire,
                                                "nom_file",piv[0].titre)
              .then(function(result)
              {

                
                vm.status =  result.data.status ;

                if(vm.status)
                {
                  var nom_fiche = result.data.nom_file;
                  window.location = apiUrlExcel + repertoire + nom_fiche ;
                  vm.affiche_load =false; 

                }
                else
                {
                  vm.affiche_load =false;
                  var message=result.data.message;
                  vm.Alert('Export en excel',message);
                  
                }
               
          
              });
            }
            else
            {
              vm.Alert('Information!','En cours de dévéloppement');
            }

            
          }


          vm.Alert = function(titre,content) 
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

        //recuperation district par region
        vm.modifierregion = function(filtre)
        {   
            vm.allcommune = [] ;
            apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",filtre.region_id).then(function(result)
            {
              vm.filtre.district_id = '*' ;
              vm.filtre.commune_id = '*' ;
              vm.alldistrict = result.data.response;
              vm.isDistrict = true;
            });
        }

        //recuperation commune par district
        vm.modifierdistrict = function(filtre)
        {   console.log(filtre.district_id);
            if (filtre.district_id!='*')
            {
                apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",filtre.district_id).then(function(result)
                {
                  vm.filtre.commune_id = '*' ;
                  vm.allcommune = result.data.response; 
                  vm.isCommune = true;
                });
            }
            
        }
        //recuperation commune par district
        vm.modifiercommune = function(filtre)
        {   console.log(filtre.district_id);
            if (filtre.district_id!='*')
            {
                apiFactory.getAPIgeneraliserREST("fokontany/index","cle_etrangere",filtre.commune_id).then(function(result)
                {
                  console.log(result.data.response);
                });
            }
            
        }

        //masque de table
        vm.cacher_table = function(mot_a_cherecher,string)
        {
            if (!string) 
            {
            string = "" ;
            }
            var res = string.indexOf(mot_a_cherecher);
            if (res != -1) 
            {
            return true ;
            }
          else
            {
            return false ;
            }
        }

        //nombre après virgul = 0
        vm.nombre_apre_virgul = function(val)
        {
            var nbr=parseFloat(val).toFixed(3);

            return nbr;
         
        }
       
       /*********FIN ONGLET EFFECTIF AGE SEXE*********/

    }
})();
