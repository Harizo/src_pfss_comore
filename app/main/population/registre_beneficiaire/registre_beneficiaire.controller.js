(function ()
{
    'use strict';

    angular
        .module('app.population.registre_beneficiaire')
        .controller('registre_beneficiaireController', registre_beneficiaireController);

    /** @ngInject */
    function registre_beneficiaireController($scope, $mdDialog, apiFactory,$state, apiUrlExcel)
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

        vm.pivots = [
          
          
          {
            titre:"Registre bénéficiaires",
            id:"liste_beneficiaire_intevention",
            category:"theme1"
          }, 


        ];




        //  harizo
        vm.couleur = function(val1, val2)
        {
        
          if ( (val1 >0) || (val2 > 0) ) 
          {
            
            return "#cecece" ;
          }
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
        /*apiFactory.getAll("region/index").then(function(result)
        {
            vm.allregion = result.data.response;    
        });*/

        vm.load_ddb = true ;
        apiFactory.getAPIgeneraliserREST("region/index","all_filter",1).then(function(result)
        {
            vm.allregion = result.data.response;    

            vm.load_ddb = false ;
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
                                              "menu","liste_beneficiaire_intevention",
                                              "id_region",filtre.region_id,
                                              "id_district",filtre.district_id,
                                              "id_commune",filtre.commune_id,
                                              "id_intervention",filtre.intervention_id)//fin code harizo
            .then(function(result)
            {

              
                  vm.datas = result.data.response;
                  vm.affiche_load = false ;
                  console.log(vm.datas);
             
        
            });

          }

          vm.export_excel = function(filtre)
          {
            
              vm.affiche_load = true ;

              var repertoire = "registre_beneficiaire/" ;

              var piv = vm.pivots.filter(function(obj) {
                return obj.id == vm.filtre.pivot;
              });

              apiFactory.getAPIgeneraliserREST("Export_excel/index",
                                                "menu","liste_beneficiaire_intevention",
                                                "id_region",filtre.region_id,
                                                "id_district",filtre.district_id,
                                                "id_commune",filtre.commune_id,
                                                "id_intervention",filtre.intervention_id,
                                                "id_type_transfert",filtre.id_type_transfert,
                                                "date_debut",convertionDate(filtre.date_debut),
                                                "date_fin",convertionDate(filtre.date_fin),
                                                "repertoire",repertoire,
                                                "nom_file","Registre beneficiaires")
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
            vm.load_ddb = true ;
            //apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",filtre.region_id).then(function(result)
            apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",filtre.region_id,"data_non_vide",1).then(function(result)
            {
              vm.filtre.district_id =  null;
              vm.filtre.commune_id = '*' ;
              vm.alldistrict = result.data.response;
              vm.isDistrict = true;

              vm.load_ddb = false ;
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
