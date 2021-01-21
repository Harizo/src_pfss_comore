(function ()
{
    'use strict';

    angular
        .module('app.population.reporting.carte')
        .controller('carteController', carteController);

    /** @ngInject */
    function carteController($scope, $mdDialog, apiFactory,$state, apiUrlExcel, uiGmapGoogleMapApi,$cookieStore)
    {
      var vm = this ;

      //recuperation region
      vm.load_ddb = true ;
        apiFactory.getAPIgeneraliserREST("region/index","all_filter",1).then(function(result)
        {
            vm.allregion = result.data.response;    

            vm.load_ddb = false ;
        });

      //recuperation district par region
        /*vm.modifierregion = function(filtre)
        {   
            vm.allcommune = [] ;
            apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",filtre.region_id).then(function(result)
            {
              vm.filtre_carte.district_id = '*' ;
              vm.filtre_carte.commune_id = '*' ;
              vm.alldistrict = result.data.response;
              vm.isDistrict = true;
            });
        }
*/
        vm.modifierregion = function(filtre)
        {   
           
            vm.load_ddb = true ;
            apiFactory.getAPIgeneraliserREST("district/index","cle_etrangere",filtre.region_id,"data_non_vide",1).then(function(result)
            {
              
              vm.filtre_carte.district_id = '*' ;
              vm.alldistrict = result.data.response;
              vm.isDistrict = true;

              vm.load_ddb = false ;
            });
        }

        

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
          },
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


      var vm = this ;
        uiGmapGoogleMapApi.then(function (maps)
        {
          vm.map = maps ;
          //console.log("version carte == " +maps.version);
          vm.map = 
          {
              center: {
                  latitude : -18.881728,
                  longitude: 47.510447
              },
              zoom  : 6,
              events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                              // console.info('this is the map instance', map);

                        });
                    },
                    click: function(map, eventName,latLngArgs)
                    { 


                      var pts = 
                      {
                        lat: latLngArgs[0].latLng.lat(), 
                        lng: latLngArgs[0].latLng.lng()
                      };

                      map.setCenter(pts);
                      //map.setZoom(10); 

                    }
                }
          };


          vm.windowOptions = {
              visible: true 
          };

          var id_user = $cookieStore.get('id');
         

          

          vm.affichage_commune_in_carte = function()
          {

            vm.load_ddb = true ;

            //apiFactory.getAll("commune/index").then(function(result) 
            apiFactory.getAPIgeneraliserREST("commune/index","district_id",vm.filtre_carte.district_id,"etat_carte",1).then(function(result)
            {

                vm.polylines = [];  
               

              vm.all_commune = result.data.response ;

              angular.forEach(vm.all_commune, function(value, key)
              {

                var item = 
                {
                  id: value.id ,
                  id_mark: "mark_"+value.id ,
                  id_win: "win"+value.id ,
                  nom: value.nom ,
                  nbr: value.nbr_menage_beneficiaire_commune,
                  path:value.coordonnees,
                  marker_cord:vm.get_center_poly(value.coordonnees),
                  marker_option:{
                    icon:'assets/icons/mark.png'
                  },
                  stroke: {
                      color: '#7f421e',
                      weight: 2
                  },                  
                  fill: {
                      
                      opacity: 0,
                      color:'#f2650e'
                       
                  },
                  events: { 
                    click: function(event)
                    { 

                    },
                    mouseover: function(gPoly, eventName, polyModel, latLngArgs) {
                      polyModel.fill.opacity = '0.5';
                    // console.log(JSON.stringify(polyModel.path));
                    },
                    mouseout: function(gPoly, eventName, polyModel, latLngArgs) {
                      polyModel.fill.opacity = '0';
                                          }
                  }
                };

              
                  vm.polylines.push(item);
                

                if (key == (vm.all_commune.length - 1)) 
                {
                  vm.map.center.latitude = vm.get_center_poly(vm.all_commune[key].coordonnees).latitude ;
                  vm.map.center.longitude = vm.get_center_poly(vm.all_commune[key].coordonnees).longitude ;
                  vm.map.zoom = 8 ;
                  vm.load_ddb = false ;
                 
                }
                
              });


            });

          }

      });


      vm.get_center_poly = function(path)
      {
        
        var centroid = [];
        centroid[0] = 0.0 ;
        centroid[1] = 0.0 ;
        path.forEach( function(element, index) 
        {
          centroid[0] += Number(element.latitude);
          centroid[1] += Number(element.longitude);
        });

        var totalPoints = path.length;
        centroid[0] = centroid[0] / totalPoints;
        centroid[1] = centroid[1] / totalPoints;

        var pts = 
        {
          latitude : centroid[0],
          longitude : centroid[1]
        }

        return pts;

      }

      vm.affiche_info_box = function(nbr)
      {
        console.log(nbr);
        if (Number(nbr) > 0) 
        {
          return true;
        }
        else
          return false;
      }


    }
})();
