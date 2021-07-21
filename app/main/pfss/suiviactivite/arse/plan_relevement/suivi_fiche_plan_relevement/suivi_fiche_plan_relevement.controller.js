(function () {
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.suivi_fiche_plan_relevement')
        .controller('suivi_fiche_plan_relevementController', suivi_fiche_plan_relevementController);

    /** @ngInject */
    function suivi_fiche_plan_relevementController(apiFactory, $scope, $mdDialog, apiUrlExcel) {
        var vm = this;

        vm.identification = {};
        vm.all_commune = [];
        vm.all_village = [];

        vm.date_now = new Date();

        vm.formatMillier = function (nombre) {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return vm.replace_point(nombre);
            } else {
                return vm.replace_point(nombre);
            }
        }

        vm.replace_point = function (nbr) {


            if (nbr) {
                var str = "" + nbr;
                var res = str.replace(".", ",");
                return res;
            }
            else
                return nbr;
        }

        apiFactory.getAll("ile").then(function (result) {
            vm.all_ile = result.data.response;
        });

        apiFactory.getAll("region").then(function (result) {
            vm.all_regions = result.data.response;

        });

        apiFactory.getAll("commune").then(function (result) {
            vm.all_communes = result.data.response;

        });

        apiFactory.getAll("village").then(function (result) {
            vm.all_villages = result.data.response;

        });

        $scope.$watch('vm.identification.id_ile', function () {
            if (!vm.identification.id_ile) return;
            else {

                vm.all_commune = [];
                vm.all_village = [];



                vm.all_region = vm.all_regions;
                vm.all_region = vm.all_region.filter(function (obj) {
                    return obj.ile.id == vm.identification.id_ile;
                })
            }

        })

        $scope.$watch('vm.identification.id_region', function () {
            if (!vm.identification.id_region) return;
            else {
                vm.all_village = [];




                vm.all_commune = vm.all_communes;
                vm.all_commune = vm.all_commune.filter(function (obj) {
                    return obj.prefecture.id == vm.identification.id_region;
                })
            }

        })

        $scope.$watch('vm.identification.id_commune', function () {
            if (!vm.identification.id_commune) return;
            else {

                vm.all_village = vm.all_villages;
                vm.all_village = vm.all_village.filter(function (obj) {
                    return obj.commune.id == vm.identification.id_commune;
                })
            }

        })

        $scope.$watch('vm.identification.id_village', function () {

            var v = vm.all_village.filter(function (obj) {
                return obj.id == vm.identification.id_village;
            })

            if (v.length > 0 && v[0].zip != null) {
                vm.identification.zip = v[0].zip.libelle;
                vm.identification.vague = v[0].vague;
                vm.get_menage_by_village();

            }
            else {
                vm.identification.zip = "";
                vm.identification.vague = "";
            }


            if (vm.identification.id_village) {
                vm.get_menage_by_village();

                vm.get_ml_pl_by_village();
            }




        })

        apiFactory.getAll("Agent_ex/index").then(function (result) {
            vm.all_agex = result.data.response;
        });

        vm.get_menage_by_village = function () {
            vm.affiche_load = true;
            apiFactory.getParamsDynamic("Menage/index?cle_etrangere=" + vm.identification.id_village).then(function (result) {
                vm.affiche_load = false;
                vm.all_menage = result.data.response;
                

            });

          
        }

        vm.get_ml_pl_by_village = function () {
            vm.affiche_load = true;
           

            apiFactory.getParamsDynamic("Groupe_mlpl/index?cle_etrangere=" + vm.identification.id_village).then(function (result) {
                vm.affiche_load = false;
                vm.all_ml_pl = result.data.response;
                

            });
        }

        vm.open_masque_filtre = function () {
            vm.affichage_masque_filtre = true;
            vm.affichage_masque = false;
            //vm.filtre.date_fin = vm.date_now ;
        }

        vm.fermer_masque_filtre = function () {
            vm.affichage_masque_filtre = false;
        }

        function convert_to_date_sql(date) {
            if (date) {
                var d = new Date(date);
                var jour = d.getDate();
                var mois = d.getMonth() + 1;
                var annee = d.getFullYear();
                if (mois < 10) {
                    mois = '0' + mois;
                }
                if (jour < 10) {
                    jour = '0' + jour;
                }
                var date_final = annee + "-" + mois + "-" + jour;
                return date_final
            }
        }


        vm.convert_to_date_html = function (date) {
           
            if (date && (date != "0000-00-00") && (date != null)) {
                var d = new Date(date);
                var jour = d.getDate();
                var mois = d.getMonth() + 1;
                var annee = d.getFullYear();
                if (mois < 10) {
                    mois = '0' + mois;
                }
                if (jour < 10) {
                    jour = '0' + jour;
                }
                var date_final = jour + "-" + mois + "-" + annee;
                return date_final
            }
            else
            {
                return "";
            }
        }

        //identification
            vm.affichage_masque = false;
            var nouvelle_identification = false;
            vm.identification = {};
            vm.filtre = {};
            vm.all_identification = [];
            vm.selected_identification = {};


            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve: 'true',
                order: []
            };

            vm.entete_identification =
                [

                    { titre: "Ménage" },
                    { titre: "AGEX" }
                ];


            vm.open_masque_filtre = function () {
                vm.affichage_masque_filtre = true;
                vm.affichage_masque = false;
                vm.filtre.date_fin = vm.date_now;
            }

            vm.fermer_masque_filtre = function () {
                vm.affichage_masque_filtre = false;
            }

            vm.get_identification = function (data_filtre) {
                vm.affiche_load = true;
                apiFactory.getParamsDynamic("Fiche_suivi_plan_relevement/index?id_village=" + data_filtre.id_village).then(function (result) {
                    vm.all_identification = result.data.response;
                    vm.affiche_load = false;
                });
            }

            $scope.$watch('vm.identification.id_menage', function () {
                if (!vm.identification.id_menage) return;
                else {
                    vm.affiche_load = true;
                    apiFactory.getParamsDynamic("Fiche_suivi_plan_relevement/index?id_menage=" + vm.identification.id_menage).then(function (result) {
                        var comp = result.data.response;
                        vm.identification.composition_menage = "Nbr Homme = " + comp[0].nbr_homme + " Nbr Femme = " + comp[0].nbr_femme;
                        vm.affiche_load = false;
                    });

                }

            })

            $scope.$watch('vm.identification.id_agex', function () {
                if (!vm.identification.id_agex) return;
                else {



                    if (nouvelle_identification) {
                        var agex = vm.all_agex.filter(function (obj) {
                            return obj.id == vm.identification.id_agex;
                        });

                        vm.identification.representant_agex = agex[0].intervenant_agex;
                    }

                }

            })




            



            vm.selection = function (item) {
                vm.selected_identification = item;


            }

            $scope.$watch('vm.selected_identification', function () {
                if (!vm.all_identification) return;
                vm.all_identification.forEach(function (item) {
                    item.$selected = false;
                });
                vm.selected_identification.$selected = true;
            })

            vm.ajout_identification = function () {
                vm.affichage_masque = true;
                vm.affichage_masque_filtre = false;


                nouvelle_identification = true;

                vm.identification = {};

            }

            vm.annuler = function () {
                vm.affichage_masque = false;
                vm.affichage_masque_filtre = false;
                nouvelle_identification = false;

                vm.selected_identification = {};
            }

            vm.modif_identification = function () {
                vm.affichage_masque = true;
                vm.affichage_masque_filtre = false;
                nouvelle_identification = false;

                vm.identification.id_village = vm.selected_identification.id_village;
                vm.identification.id_menage = vm.selected_identification.id_menage;

                vm.identification.id_agex = vm.selected_identification.id_agex;
            }

            vm.supprimer_identification = function () {
                vm.affichage_masque_societe_crevette = false;

                var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('ok')
                    .cancel('annuler');
                $mdDialog.show(confirm).then(function () {

                    vm.save_in_bdd(vm.selected_identification, 1);
                }, function () {
                    //alert('rien');
                });
            }

            var repertoire = "suivificheplanrelevement/";
            vm.export_excel = function () 
            {
                var m = vm.all_menage.filter(function (obj) {
                        return obj.id == vm.selected_identification.id_menage;
                    });
             

                vm.affiche_load = true;
                apiFactory.getParamsDynamic("Fiche_suivi_plan_relevement/index?export_excel="+1+
                    "&repertoire="+repertoire+
                    "&identifiant_menage="+m[0].identifiant_menage+
                    "&nomchefmenage="+m[0].nomchefmenage+
                    "&NomTravailleur="+m[0].NomTravailleur+
                    "&NomTravailleurSuppliant="+m[0].NomTravailleurSuppliant+
                    "&id_village="+vm.identification.id_village+
                    "&id="+vm.selected_identification.id).then(function(result)
                {

                    var nom_file = result.data.nom_file;
                    vm.affiche_load = false ;
                    window.location = apiUrlExcel+repertoire+nom_file ;
                  
                        
                });
                
            }

            vm.save_in_bdd = function (data_masque, etat_suppression) {
                vm.affiche_load = true;
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                var id = 0;

                if (!nouvelle_identification) {
                    id = vm.selected_identification.id;
                }






                var datas = $.param(
                    {

                        id: id,
                        supprimer: etat_suppression,

                        id_village: data_masque.id_village,
                        id_menage: data_masque.id_menage,
                        id_agex: data_masque.id_agex

                    });

                apiFactory.add("Fiche_suivi_plan_relevement/index", datas, config).success(function (data) {



                    var v = vm.all_village.filter(function (obj) {
                        return obj.id == data_masque.id_village;
                    });

                    var c = vm.all_commune.filter(function (obj) {
                        return obj.id == data_masque.id_commune;
                    });

                    var r = vm.all_region.filter(function (obj) {
                        return obj.id == data_masque.id_region;
                    });

                    var i = vm.all_ile.filter(function (obj) {
                        return obj.id == data_masque.id_ile;
                    });

                    var m = vm.all_menage.filter(function (obj) {
                        return obj.id == data_masque.id_menage;
                    });

                    var ag = vm.all_agex.filter(function (obj) {
                        return obj.id == data_masque.id_agex;
                    });
                

                    if (!nouvelle_identification) {
                        if (etat_suppression == 0) {

                            vm.selected_identification.zip = data_masque.zip;
                            vm.selected_identification.vague = data_masque.vague;


                            vm.selected_identification.id_village = data_masque.id_village;
                            vm.selected_identification.Village = v[0].Village;

                            vm.selected_identification.id_commune = data_masque.id_commune;
                            vm.selected_identification.Commune = c[0].Commune;

                            vm.selected_identification.id_region = data_masque.id_region;
                            vm.selected_identification.Region = r[0].Region;

                            vm.selected_identification.id_ile = data_masque.id_ile;
                            vm.selected_identification.Ile = i[0].Ile;

                            vm.selected_identification.id_village = data_masque.id_village;

                            vm.selected_identification.id_menage = data_masque.id_menage;
                            vm.selected_identification.identifiant_menage = m[0].identifiant_menage;
                            vm.selected_identification.nom_chef_menage = m[0].nomchefmenage;
                            vm.selected_identification.NomTravailleur = m[0].NomTravailleur;
                            vm.selected_identification.NomTravailleurSuppliant = m[0].NomTravailleurSuppliant;

                            vm.selected_identification.id_agex = data_masque.id_agex;
                            vm.selected_identification.nom_agex = ag[0].Nom;


                        }
                        else {
                            vm.all_identification = vm.all_identification.filter(function (obj) {
                                return obj.id !== vm.selected_identification.id;
                            });
                        }

                    }
                    else {
                        var item = {
                            id: String(data.response),

                            id_village: data_masque.id_village,
                            Village: v[0].Village,

                            id_commune: data_masque.id_commune,
                            Commune: c[0].Commune,

                            id_region: data_masque.id_region,
                            Region: r[0].Region,

                            id_ile: data_masque.id_ile,
                            Ile: i[0].Ile,


                            id_menage: data_masque.id_menage,
                            identifiant_menage: m[0].identifiant_menage,
                            nom_chef_menage: m[0].nomchefmenage,
                            NomTravailleur: m[0].NomTravailleur,
                            NomTravailleurSuppliant: m[0].NomTravailleurSuppliant,

                            id_agex: data_masque.id_agex,
                            nom_agex: ag[0].Nom
                        }



                        vm.all_identification.unshift(item);
                    }
                    nouvelle_identification = false;
                    vm.affichage_masque = false;
                    vm.affiche_load = false;
                })
                    .error(function (data) { alert("Une erreur s'est produit"); });
            }

        //identification

        //intervenants

            vm.benefice = 0 ;
            vm.total_produit = 0 ;
            vm.total_depense = 0 ;
            vm.get_plan_production = function (argument) 
            {
                vm.get_all_fiche_suivi_plan_relevement_intervenants();
                vm.get_all_fiche_plan_relevement_plan_production_deux_produit();
                vm.get_all_fiche_plan_relevement_plan_production_deux_depense();
                vm.get_all_fiche_plan_relevement_plan_production_trois();
            }
            //fiche_suivi_plan_relevement_intervenants 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_suivi_plan_relevement_intervenants = [] ;

                vm.entete_fiche_suivi_plan_relevement_intervenants =
                [
                    {titre:"Bureau régional"},
                    {titre:"CPS"},
                    {titre:"ADC"},
                    {titre:"ML/PL"},
                    {titre:"Autres"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_suivi_plan_relevement_intervenants = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_suivi_plan_relevement_intervenants/index","id_fspr",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_suivi_plan_relevement_intervenants = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_suivi_plan_relevement_intervenants..
                    
                    vm.selected_fiche_suivi_plan_relevement_intervenants = {} ;
                    var current_selected_fiche_suivi_plan_relevement_intervenants = {} ;
                     vm.nouvelle_fiche_suivi_plan_relevement_intervenants = false ;

                
                    vm.selection_fiche_suivi_plan_relevement_intervenants = function(item)
                    {
                        vm.selected_fiche_suivi_plan_relevement_intervenants = item ;

                        if (!vm.selected_fiche_suivi_plan_relevement_intervenants.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_suivi_plan_relevement_intervenants = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_suivi_plan_relevement_intervenants', function()
                    {
                        if (!vm.all_fiche_suivi_plan_relevement_intervenants) return;
                        vm.all_fiche_suivi_plan_relevement_intervenants.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_suivi_plan_relevement_intervenants.$selected = true;

                    });

                   

                    vm.ajouter_fiche_suivi_plan_relevement_intervenants = function()
                    {
                        vm.nouvelle_fiche_suivi_plan_relevement_intervenants = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_fspr:vm.selected_identification.id,
                                bureau_regional:'',
                                cps:'',
                                adc:'',
                                objectif:null,
                                autres:''
                                
                            } ;

                        vm.all_fiche_suivi_plan_relevement_intervenants.unshift(item);
                        vm.all_fiche_suivi_plan_relevement_intervenants.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_suivi_plan_relevement_intervenants = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_suivi_plan_relevement_intervenants = function()
                    {
                        vm.nouvelle_fiche_suivi_plan_relevement_intervenants = false ;
                        vm.selected_fiche_suivi_plan_relevement_intervenants.$edit = true;
                    
                        current_selected_fiche_suivi_plan_relevement_intervenants = angular.copy(vm.selected_fiche_suivi_plan_relevement_intervenants);
                    }

                    vm.supprimer_fiche_suivi_plan_relevement_intervenants = function()
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

                        vm.enregistrer_fiche_suivi_plan_relevement_intervenants(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_suivi_plan_relevement_intervenants = function()
                    {
                        if (vm.nouvelle_fiche_suivi_plan_relevement_intervenants) 
                        {
                            
                            vm.all_fiche_suivi_plan_relevement_intervenants.shift();
                            vm.selected_fiche_suivi_plan_relevement_intervenants = {} ;
                            vm.nouvelle_fiche_suivi_plan_relevement_intervenants = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_suivi_plan_relevement_intervenants.$edit) //annuler selection
                            {
                                vm.selected_fiche_suivi_plan_relevement_intervenants.$selected = false;
                                vm.selected_fiche_suivi_plan_relevement_intervenants = {};
                            }
                            else
                            {
                                vm.selected_fiche_suivi_plan_relevement_intervenants.$selected = false;
                                vm.selected_fiche_suivi_plan_relevement_intervenants.$edit = false;
                            
                                vm.selected_fiche_suivi_plan_relevement_intervenants.bureau_regional = current_selected_fiche_suivi_plan_relevement_intervenants.bureau_regional;  
                                vm.selected_fiche_suivi_plan_relevement_intervenants.cps = current_selected_fiche_suivi_plan_relevement_intervenants.cps;  
                                vm.selected_fiche_suivi_plan_relevement_intervenants.adc = current_selected_fiche_suivi_plan_relevement_intervenants.adc;  
                                vm.selected_fiche_suivi_plan_relevement_intervenants.objectif = current_selected_fiche_suivi_plan_relevement_intervenants.objectif;  
                                vm.selected_fiche_suivi_plan_relevement_intervenants.autres = current_selected_fiche_suivi_plan_relevement_intervenants.autres;  
                                vm.selected_fiche_suivi_plan_relevement_intervenants = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_suivi_plan_relevement_intervenants = function(etat_suppression)
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
                            id:vm.selected_fiche_suivi_plan_relevement_intervenants.id,
                            id_fspr:vm.selected_identification.id,

                            bureau_regional : vm.selected_fiche_suivi_plan_relevement_intervenants.bureau_regional ,
                            cps : vm.selected_fiche_suivi_plan_relevement_intervenants.cps ,
                            adc : vm.selected_fiche_suivi_plan_relevement_intervenants.adc ,
                            objectif : vm.selected_fiche_suivi_plan_relevement_intervenants.objectif ,
                            autres : vm.selected_fiche_suivi_plan_relevement_intervenants.autres ,
                            acheter_ou : vm.selected_fiche_suivi_plan_relevement_intervenants.acheter_ou 
                            
                            
                            
                        });

                        apiFactory.add("fiche_suivi_plan_relevement_intervenants/index",datas, config).success(function (data)
                        {
                            var mlpl = vm.all_ml_pl.filter(function (obj) 
                            {
                                return obj.id == vm.selected_fiche_suivi_plan_relevement_intervenants.objectif ;
                            });


                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_suivi_plan_relevement_intervenants) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_suivi_plan_relevement_intervenants.$edit = false ;
                                    vm.selected_fiche_suivi_plan_relevement_intervenants.$selected = false ;
                                    vm.selected_fiche_suivi_plan_relevement_intervenants.nom_prenom_ml_pl = mlpl[0].nom_prenom_ml_pl ;
                                    vm.selected_fiche_suivi_plan_relevement_intervenants = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_suivi_plan_relevement_intervenants = vm.all_fiche_suivi_plan_relevement_intervenants.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_suivi_plan_relevement_intervenants.id;
                                    });

                                    vm.selected_fiche_suivi_plan_relevement_intervenants = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_suivi_plan_relevement_intervenants.$edit = false ;
                                vm.selected_fiche_suivi_plan_relevement_intervenants.$selected = false ;
                                vm.selected_fiche_suivi_plan_relevement_intervenants.nom_prenom_ml_pl = mlpl[0].nom_prenom_ml_pl ;
                                vm.selected_fiche_suivi_plan_relevement_intervenants.id = String(data.response) ;

                                vm.nouvelle_fiche_suivi_plan_relevement_intervenants = false ;
                                vm.selected_fiche_suivi_plan_relevement_intervenants = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_suivi_plan_relevement_intervenants..
            //FIN fiche_suivi_plan_relevement_intervenants

          
        //FIN intervenants

        //fiche_suivi_plan_relevement_presentation

            vm.benefice = 0 ;
            vm.total_produit = 0 ;
            vm.total_depense = 0 ;
            vm.get_plan_production = function (argument) 
            {
                vm.get_all_fiche_suivi_plan_relevement_presentation();
                vm.get_all_fiche_plan_relevement_plan_production_deux_produit();
                vm.get_all_fiche_plan_relevement_plan_production_deux_depense();
                vm.get_all_fiche_plan_relevement_plan_production_trois();
            }
            //fiche_suivi_plan_relevement_presentation 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_suivi_plan_relevement_presentation = [] ;

                vm.entete_fiche_suivi_plan_relevement_presentation =
                [
                    {titre:"Date Suivi"},
                    {titre:"Activité"},
                    {titre:"Date démarage actiité"},
                    {titre:"Objectif"},
                    {titre:"Stade réalisation activité"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_suivi_plan_relevement_presentation = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_suivi_plan_relevement_presentation/index","id_fspr",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_suivi_plan_relevement_presentation = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_suivi_plan_relevement_presentation..
                    
                    vm.selected_fiche_suivi_plan_relevement_presentation = {} ;
                    var current_selected_fiche_suivi_plan_relevement_presentation = {} ;
                     vm.nouvelle_fiche_suivi_plan_relevement_presentation = false ;

                
                    vm.selection_fiche_suivi_plan_relevement_presentation = function(item)
                    {
                        vm.selected_fiche_suivi_plan_relevement_presentation = item ;

                        if (!vm.selected_fiche_suivi_plan_relevement_presentation.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_suivi_plan_relevement_presentation = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_suivi_plan_relevement_presentation', function()
                    {
                        if (!vm.all_fiche_suivi_plan_relevement_presentation) return;
                        vm.all_fiche_suivi_plan_relevement_presentation.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_suivi_plan_relevement_presentation.$selected = true;

                    });

                   

                    vm.ajouter_fiche_suivi_plan_relevement_presentation = function()
                    {
                        vm.nouvelle_fiche_suivi_plan_relevement_presentation = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_fspr:vm.selected_identification.id,
                                date_suivi:null,
                                activite:'',
                                date_demarage_activite:null,
                                objectif:'',
                                stade_realisation_activite:''
                                
                            } ;

                        vm.all_fiche_suivi_plan_relevement_presentation.unshift(item);
                        vm.all_fiche_suivi_plan_relevement_presentation.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_suivi_plan_relevement_presentation = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_suivi_plan_relevement_presentation = function()
                    {
                        vm.nouvelle_fiche_suivi_plan_relevement_presentation = false ;
                        vm.selected_fiche_suivi_plan_relevement_presentation.$edit = true;
                        vm.selected_fiche_suivi_plan_relevement_presentation.date_suivi = new Date(vm.selected_fiche_suivi_plan_relevement_presentation.date_suivi);
                        vm.selected_fiche_suivi_plan_relevement_presentation.date_demarage_activite = new Date(vm.selected_fiche_suivi_plan_relevement_presentation.date_demarage_activite);
                    
                        current_selected_fiche_suivi_plan_relevement_presentation = angular.copy(vm.selected_fiche_suivi_plan_relevement_presentation);
                    }

                    vm.supprimer_fiche_suivi_plan_relevement_presentation = function()
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

                        vm.enregistrer_fiche_suivi_plan_relevement_presentation(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_suivi_plan_relevement_presentation = function()
                    {
                        if (vm.nouvelle_fiche_suivi_plan_relevement_presentation) 
                        {
                            
                            vm.all_fiche_suivi_plan_relevement_presentation.shift();
                            vm.selected_fiche_suivi_plan_relevement_presentation = {} ;
                            vm.nouvelle_fiche_suivi_plan_relevement_presentation = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_suivi_plan_relevement_presentation.$edit) //annuler selection
                            {
                                vm.selected_fiche_suivi_plan_relevement_presentation.$selected = false;
                                vm.selected_fiche_suivi_plan_relevement_presentation = {};
                            }
                            else
                            {
                                vm.selected_fiche_suivi_plan_relevement_presentation.$selected = false;
                                vm.selected_fiche_suivi_plan_relevement_presentation.$edit = false;
                            
                                vm.selected_fiche_suivi_plan_relevement_presentation.date_suivi = current_selected_fiche_suivi_plan_relevement_presentation.date_suivi;  
                                vm.selected_fiche_suivi_plan_relevement_presentation.activite = current_selected_fiche_suivi_plan_relevement_presentation.activite;  
                                vm.selected_fiche_suivi_plan_relevement_presentation.date_demarage_activite = current_selected_fiche_suivi_plan_relevement_presentation.date_demarage_activite;  
                                vm.selected_fiche_suivi_plan_relevement_presentation.objectif = current_selected_fiche_suivi_plan_relevement_presentation.objectif;  
                                vm.selected_fiche_suivi_plan_relevement_presentation.stade_realisation_activite = current_selected_fiche_suivi_plan_relevement_presentation.stade_realisation_activite;  
                                vm.selected_fiche_suivi_plan_relevement_presentation = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_suivi_plan_relevement_presentation = function(etat_suppression)
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
                            id:vm.selected_fiche_suivi_plan_relevement_presentation.id,
                            id_fspr:vm.selected_identification.id,

                            date_suivi : convert_to_date_sql(vm.selected_fiche_suivi_plan_relevement_presentation.date_suivi) ,
                            activite : vm.selected_fiche_suivi_plan_relevement_presentation.activite ,
                            date_demarage_activite : convert_to_date_sql(vm.selected_fiche_suivi_plan_relevement_presentation.date_demarage_activite) ,
                            objectif : vm.selected_fiche_suivi_plan_relevement_presentation.objectif ,
                            stade_realisation_activite : vm.selected_fiche_suivi_plan_relevement_presentation.stade_realisation_activite 


                           
                            
                            
                            
                        });

                        apiFactory.add("fiche_suivi_plan_relevement_presentation/index",datas, config).success(function (data)
                        {
                     

                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_suivi_plan_relevement_presentation) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_suivi_plan_relevement_presentation.$edit = false ;
                                    vm.selected_fiche_suivi_plan_relevement_presentation.$selected = false ;
                                    vm.selected_fiche_suivi_plan_relevement_presentation = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_suivi_plan_relevement_presentation = vm.all_fiche_suivi_plan_relevement_presentation.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_suivi_plan_relevement_presentation.id;
                                    });

                                    vm.selected_fiche_suivi_plan_relevement_presentation = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_suivi_plan_relevement_presentation.$edit = false ;
                                vm.selected_fiche_suivi_plan_relevement_presentation.$selected = false ;
                                vm.selected_fiche_suivi_plan_relevement_presentation.id = String(data.response) ;

                                vm.nouvelle_fiche_suivi_plan_relevement_presentation = false ;
                                vm.selected_fiche_suivi_plan_relevement_presentation = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_suivi_plan_relevement_presentation..
            //FIN fiche_suivi_plan_relevement_presentation

          
        //FIN fiche_suivi_plan_relevement_presentation


        //fiche_suivi_plan_relevement_materiel 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_suivi_plan_relevement_materiel = [] ;

            vm.entete_fiche_suivi_plan_relevement_materiel =
            [
                
                {titre:"Désignation"},
                {titre:"Quantité"},
                {titre:"Prix unitaire"},
                {titre:"Observation"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_suivi_plan_relevement_materiel = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_suivi_plan_relevement_materiel/index","id_fspr",vm.selected_identification.id).then(function(result){
                    vm.all_fiche_suivi_plan_relevement_materiel = result.data.response;
                    
                    vm.affiche_load = false ;
                


                });  
            }

            //fiche_suivi_plan_relevement_materiel..
                
                vm.selected_fiche_suivi_plan_relevement_materiel = {} ;
                var current_selected_fiche_suivi_plan_relevement_materiel = {} ;
                 vm.nouvelle_fiche_suivi_plan_relevement_materiel = false ;

            
                vm.selection_fiche_suivi_plan_relevement_materiel = function(item)
                {
                    vm.selected_fiche_suivi_plan_relevement_materiel = item ;

                    if (!vm.selected_fiche_suivi_plan_relevement_materiel.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_suivi_plan_relevement_materiel = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_suivi_plan_relevement_materiel', function()
                {
                    if (!vm.all_fiche_suivi_plan_relevement_materiel) return;
                    vm.all_fiche_suivi_plan_relevement_materiel.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_suivi_plan_relevement_materiel.$selected = true;

                });


        
             

          

               

                vm.ajouter_fiche_suivi_plan_relevement_materiel = function()
                {
                    vm.nouvelle_fiche_suivi_plan_relevement_materiel = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fspr:vm.selected_identification.id,
                        
                            designation:'',
                        
                            quantite:'',
                            prix_unitaire:'',
                       
                            observation:''
                            
                        } ;

                    vm.all_fiche_suivi_plan_relevement_materiel.unshift(item);
                    vm.all_fiche_suivi_plan_relevement_materiel.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_suivi_plan_relevement_materiel = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_suivi_plan_relevement_materiel = function()
                {
                    vm.nouvelle_fiche_suivi_plan_relevement_materiel = false ;
                    vm.selected_fiche_suivi_plan_relevement_materiel.$edit = true;

                    vm.selected_fiche_suivi_plan_relevement_materiel.quantite = Number(vm.selected_fiche_suivi_plan_relevement_materiel.quantite);
                    vm.selected_fiche_suivi_plan_relevement_materiel.prix_unitaire = Number(vm.selected_fiche_suivi_plan_relevement_materiel.prix_unitaire);
                   // vm.selected_fiche_suivi_plan_relevement_materiel.montant = Number(vm.selected_fiche_suivi_plan_relevement_materiel.montant);
                
                    current_selected_fiche_suivi_plan_relevement_materiel = angular.copy(vm.selected_fiche_suivi_plan_relevement_materiel);
                }

                vm.supprimer_fiche_suivi_plan_relevement_materiel = function()
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

                    vm.enregistrer_fiche_suivi_plan_relevement_materiel(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_suivi_plan_relevement_materiel = function()
                {
                    if (vm.nouvelle_fiche_suivi_plan_relevement_materiel) 
                    {
                        
                        vm.all_fiche_suivi_plan_relevement_materiel.shift();
                        vm.selected_fiche_suivi_plan_relevement_materiel = {} ;
                        vm.nouvelle_fiche_suivi_plan_relevement_materiel = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_suivi_plan_relevement_materiel.$edit) //annuler selection
                        {
                            vm.selected_fiche_suivi_plan_relevement_materiel.$selected = false;
                            vm.selected_fiche_suivi_plan_relevement_materiel = {};
                        }
                        else
                        {
                            vm.selected_fiche_suivi_plan_relevement_materiel.$selected = false;
                            vm.selected_fiche_suivi_plan_relevement_materiel.$edit = false;
                        
                            vm.selected_fiche_suivi_plan_relevement_materiel.designation = current_selected_fiche_suivi_plan_relevement_materiel.designation;  
                            
                            vm.selected_fiche_suivi_plan_relevement_materiel.quantite = current_selected_fiche_suivi_plan_relevement_materiel.quantite;  
                            vm.selected_fiche_suivi_plan_relevement_materiel.prix_unitaire = current_selected_fiche_suivi_plan_relevement_materiel.prix_unitaire;  
                            
                            vm.selected_fiche_suivi_plan_relevement_materiel.observation = current_selected_fiche_suivi_plan_relevement_materiel.observation;  
                            vm.selected_fiche_suivi_plan_relevement_materiel = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_suivi_plan_relevement_materiel = function(etat_suppression)
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
                        id:vm.selected_fiche_suivi_plan_relevement_materiel.id,
                        id_fspr:vm.selected_identification.id,

                       

                        designation : vm.selected_fiche_suivi_plan_relevement_materiel.designation ,
                      
                        quantite : vm.selected_fiche_suivi_plan_relevement_materiel.quantite ,
                        prix_unitaire : vm.selected_fiche_suivi_plan_relevement_materiel.prix_unitaire ,
                        observation : vm.selected_fiche_suivi_plan_relevement_materiel.observation 
                        
                        
                        
                    });

                    apiFactory.add("fiche_suivi_plan_relevement_materiel/index",datas, config).success(function (data)
                    {
                    
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_suivi_plan_relevement_materiel) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_suivi_plan_relevement_materiel.$edit = false ;
                                vm.selected_fiche_suivi_plan_relevement_materiel.$selected = false ;
                                vm.selected_fiche_suivi_plan_relevement_materiel = {} ;
                            }
                            else
                            {
                                vm.all_fiche_suivi_plan_relevement_materiel = vm.all_fiche_suivi_plan_relevement_materiel.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_suivi_plan_relevement_materiel.id;
                                });

                                vm.selected_fiche_suivi_plan_relevement_materiel = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_suivi_plan_relevement_materiel.$edit = false ;
                            vm.selected_fiche_suivi_plan_relevement_materiel.$selected = false ;
                            vm.selected_fiche_suivi_plan_relevement_materiel.id = String(data.response) ;

                            vm.nouvelle_fiche_suivi_plan_relevement_materiel = false ;
                            vm.selected_fiche_suivi_plan_relevement_materiel = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_suivi_plan_relevement_materiel..
        //FIN fiche_suivi_plan_relevement_materiel

        //fiche_suivi_prelevement_probleme 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_suivi_prelevement_probleme = [] ;

            vm.entete_fiche_suivi_prelevement_probleme =
            [
                
                {titre:"Problème"},
                {titre:"Solutions apportées"},
                {titre:"Observations"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_suivi_prelevement_probleme = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_suivi_prelevement_probleme/index","id_fspr",vm.selected_identification.id).then(function(result){
                    vm.all_fiche_suivi_prelevement_probleme = result.data.response;
                    
                    vm.affiche_load = false ;
                


                });  
            }

            //fiche_suivi_prelevement_probleme..
                
                vm.selected_fiche_suivi_prelevement_probleme = {} ;
                var current_selected_fiche_suivi_prelevement_probleme = {} ;
                 vm.nouvelle_fiche_suivi_prelevement_probleme = false ;

            
                vm.selection_fiche_suivi_prelevement_probleme = function(item)
                {
                    vm.selected_fiche_suivi_prelevement_probleme = item ;

                    if (!vm.selected_fiche_suivi_prelevement_probleme.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_suivi_prelevement_probleme = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_suivi_prelevement_probleme', function()
                {
                    if (!vm.all_fiche_suivi_prelevement_probleme) return;
                    vm.all_fiche_suivi_prelevement_probleme.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_suivi_prelevement_probleme.$selected = true;

                });


        
             

          

               

                vm.ajouter_fiche_suivi_prelevement_probleme = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_probleme = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fspr:vm.selected_identification.id,
                            probleme:'',
                            solution:'',
                            observation:''
                            
                        } ;

                    vm.all_fiche_suivi_prelevement_probleme.unshift(item);
                    vm.all_fiche_suivi_prelevement_probleme.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_suivi_prelevement_probleme = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_suivi_prelevement_probleme = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_probleme = false ;
                    vm.selected_fiche_suivi_prelevement_probleme.$edit = true;

                
                    current_selected_fiche_suivi_prelevement_probleme = angular.copy(vm.selected_fiche_suivi_prelevement_probleme);
                }

                vm.supprimer_fiche_suivi_prelevement_probleme = function()
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

                    vm.enregistrer_fiche_suivi_prelevement_probleme(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_suivi_prelevement_probleme = function()
                {
                    if (vm.nouvelle_fiche_suivi_prelevement_probleme) 
                    {
                        
                        vm.all_fiche_suivi_prelevement_probleme.shift();
                        vm.selected_fiche_suivi_prelevement_probleme = {} ;
                        vm.nouvelle_fiche_suivi_prelevement_probleme = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_suivi_prelevement_probleme.$edit) //annuler selection
                        {
                            vm.selected_fiche_suivi_prelevement_probleme.$selected = false;
                            vm.selected_fiche_suivi_prelevement_probleme = {};
                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_probleme.$selected = false;
                            vm.selected_fiche_suivi_prelevement_probleme.$edit = false;
                        
                            vm.selected_fiche_suivi_prelevement_probleme.probleme = current_selected_fiche_suivi_prelevement_probleme.probleme;  
                            
                            vm.selected_fiche_suivi_prelevement_probleme.solution = current_selected_fiche_suivi_prelevement_probleme.solution;  
                            vm.selected_fiche_suivi_prelevement_probleme.observation = current_selected_fiche_suivi_prelevement_probleme.observation;  
                             
                            vm.selected_fiche_suivi_prelevement_probleme = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_suivi_prelevement_probleme = function(etat_suppression)
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
                        id:vm.selected_fiche_suivi_prelevement_probleme.id,
                        id_fspr:vm.selected_identification.id,

                       

                        probleme : vm.selected_fiche_suivi_prelevement_probleme.probleme ,
                      
                        solution : vm.selected_fiche_suivi_prelevement_probleme.solution ,
                        observation : vm.selected_fiche_suivi_prelevement_probleme.observation 
                        
                        
                        
                    });

                    apiFactory.add("fiche_suivi_prelevement_probleme/index",datas, config).success(function (data)
                    {
                    
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_suivi_prelevement_probleme) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_suivi_prelevement_probleme.$edit = false ;
                                vm.selected_fiche_suivi_prelevement_probleme.$selected = false ;
                                vm.selected_fiche_suivi_prelevement_probleme = {} ;
                            }
                            else
                            {
                                vm.all_fiche_suivi_prelevement_probleme = vm.all_fiche_suivi_prelevement_probleme.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_suivi_prelevement_probleme.id;
                                });

                                vm.selected_fiche_suivi_prelevement_probleme = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_probleme.$edit = false ;
                            vm.selected_fiche_suivi_prelevement_probleme.$selected = false ;
                            vm.selected_fiche_suivi_prelevement_probleme.id = String(data.response) ;

                            vm.nouvelle_fiche_suivi_prelevement_probleme = false ;
                            vm.selected_fiche_suivi_prelevement_probleme = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_suivi_prelevement_probleme..
        //FIN fiche_suivi_prelevement_probleme

        //fiche_suivi_prelevement_payement 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_suivi_prelevement_payement = [] ;

            vm.entete_fiche_suivi_prelevement_payement =
            [
                
                {titre:"N° tranches"},
                {titre:"Etat de paiement"},
                {titre:"Date de paiement"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_suivi_prelevement_payement = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_suivi_prelevement_payement/index","id_fspr",vm.selected_identification.id).then(function(result){
                    vm.all_fiche_suivi_prelevement_payement = result.data.response;
                    
                    vm.affiche_load = false ;
                


                });  
            }

            //fiche_suivi_prelevement_payement..
                
                vm.selected_fiche_suivi_prelevement_payement = {} ;
                var current_selected_fiche_suivi_prelevement_payement = {} ;
                 vm.nouvelle_fiche_suivi_prelevement_payement = false ;

            
                vm.selection_fiche_suivi_prelevement_payement = function(item)
                {
                    vm.selected_fiche_suivi_prelevement_payement = item ;

                    if (!vm.selected_fiche_suivi_prelevement_payement.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_suivi_prelevement_payement = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_suivi_prelevement_payement', function()
                {
                    if (!vm.all_fiche_suivi_prelevement_payement) return;
                    vm.all_fiche_suivi_prelevement_payement.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_suivi_prelevement_payement.$selected = true;

                });


        
             

          

               

                vm.ajouter_fiche_suivi_prelevement_payement = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_payement = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fspr:vm.selected_identification.id,
                            numero_tranche:'',
                            etat_paiement:'',
                            date_paiement:''
                            
                        } ;

                    vm.all_fiche_suivi_prelevement_payement.unshift(item);
                    vm.all_fiche_suivi_prelevement_payement.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_suivi_prelevement_payement = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_suivi_prelevement_payement = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_payement = false ;
                    vm.selected_fiche_suivi_prelevement_payement.$edit = true;
                    if (vm.selected_fiche_suivi_prelevement_payement.date_paiement == '0000-00-00') 
                    {

                        vm.selected_fiche_suivi_prelevement_payement.date_paiement = new Date();
                    }
                    else
                    {
                        vm.selected_fiche_suivi_prelevement_payement.date_paiement = new Date(vm.selected_fiche_suivi_prelevement_payement.date_paiement);
                    }

                
                    current_selected_fiche_suivi_prelevement_payement = angular.copy(vm.selected_fiche_suivi_prelevement_payement);
                }

                vm.supprimer_fiche_suivi_prelevement_payement = function()
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

                    vm.enregistrer_fiche_suivi_prelevement_payement(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_suivi_prelevement_payement = function()
                {
                    if (vm.nouvelle_fiche_suivi_prelevement_payement) 
                    {
                        
                        vm.all_fiche_suivi_prelevement_payement.shift();
                        vm.selected_fiche_suivi_prelevement_payement = {} ;
                        vm.nouvelle_fiche_suivi_prelevement_payement = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_suivi_prelevement_payement.$edit) //annuler selection
                        {
                            vm.selected_fiche_suivi_prelevement_payement.$selected = false;
                            vm.selected_fiche_suivi_prelevement_payement = {};
                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_payement.$selected = false;
                            vm.selected_fiche_suivi_prelevement_payement.$edit = false;
                        
                            vm.selected_fiche_suivi_prelevement_payement.numero_tranche = current_selected_fiche_suivi_prelevement_payement.numero_tranche;  
                            vm.selected_fiche_suivi_prelevement_payement.etat_paiement = current_selected_fiche_suivi_prelevement_payement.etat_paiement;  
                            vm.selected_fiche_suivi_prelevement_payement.date_paiement = current_selected_fiche_suivi_prelevement_payement.date_paiement;  
                             
                            vm.selected_fiche_suivi_prelevement_payement = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_suivi_prelevement_payement = function(etat_suppression)
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
                        id:vm.selected_fiche_suivi_prelevement_payement.id,
                        id_fspr:vm.selected_identification.id,

                       

                        numero_tranche : vm.selected_fiche_suivi_prelevement_payement.numero_tranche ,
                      
                        etat_paiement : vm.selected_fiche_suivi_prelevement_payement.etat_paiement ,
                        date_paiement : convert_to_date_sql(vm.selected_fiche_suivi_prelevement_payement.date_paiement) 
                        
                        
                        
                    });

                    apiFactory.add("fiche_suivi_prelevement_payement/index",datas, config).success(function (data)
                    {
                    
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_suivi_prelevement_payement) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_suivi_prelevement_payement.$edit = false ;
                                vm.selected_fiche_suivi_prelevement_payement.$selected = false ;
                                vm.selected_fiche_suivi_prelevement_payement.date_paiement = convert_to_date_sql(vm.selected_fiche_suivi_prelevement_payement.date_paiement);
                                vm.selected_fiche_suivi_prelevement_payement = {} ;
                            }
                            else
                            {
                                vm.all_fiche_suivi_prelevement_payement = vm.all_fiche_suivi_prelevement_payement.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_suivi_prelevement_payement.id;
                                });

                                vm.selected_fiche_suivi_prelevement_payement = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_payement.$edit = false ;
                            vm.selected_fiche_suivi_prelevement_payement.$selected = false ;
                            vm.selected_fiche_suivi_prelevement_payement.id = String(data.response) ;
                            vm.selected_fiche_suivi_prelevement_payement.date_paiement = convert_to_date_sql(vm.selected_fiche_suivi_prelevement_payement.date_paiement);
                            vm.nouvelle_fiche_suivi_prelevement_payement = false ;
                            vm.selected_fiche_suivi_prelevement_payement = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_suivi_prelevement_payement..
        //FIN fiche_suivi_prelevement_payement

        //fiche_suivi_prelevement_obligation 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_suivi_prelevement_obligation = [] ;

            vm.entete_fiche_suivi_prelevement_obligation =
            [
                
                {titre:"Désignation"},
                {titre:"Respect obligation"},
                {titre:"Observations"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_suivi_prelevement_obligation = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_suivi_prelevement_obligation/index","id_fspr",vm.selected_identification.id).then(function(result){
                    vm.all_fiche_suivi_prelevement_obligation = result.data.response;
                    
                    vm.affiche_load = false ;
                


                });  
            }

            //fiche_suivi_prelevement_obligation..
                
                vm.selected_fiche_suivi_prelevement_obligation = {} ;
                var current_selected_fiche_suivi_prelevement_obligation = {} ;
                 vm.nouvelle_fiche_suivi_prelevement_obligation = false ;

            
                vm.selection_fiche_suivi_prelevement_obligation = function(item)
                {
                    vm.selected_fiche_suivi_prelevement_obligation = item ;

                    if (!vm.selected_fiche_suivi_prelevement_obligation.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_suivi_prelevement_obligation = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_suivi_prelevement_obligation', function()
                {
                    if (!vm.all_fiche_suivi_prelevement_obligation) return;
                    vm.all_fiche_suivi_prelevement_obligation.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_suivi_prelevement_obligation.$selected = true;

                });


        
             

          

               

                vm.ajouter_fiche_suivi_prelevement_obligation = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_obligation = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fspr:vm.selected_identification.id,
                            designation:'',
                            respect_obligation:'',
                            observation:''
                            
                        } ;

                    vm.all_fiche_suivi_prelevement_obligation.unshift(item);
                    vm.all_fiche_suivi_prelevement_obligation.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_suivi_prelevement_obligation = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_suivi_prelevement_obligation = function()
                {
                    vm.nouvelle_fiche_suivi_prelevement_obligation = false ;
                    vm.selected_fiche_suivi_prelevement_obligation.$edit = true;

                
                    current_selected_fiche_suivi_prelevement_obligation = angular.copy(vm.selected_fiche_suivi_prelevement_obligation);
                }

                vm.supprimer_fiche_suivi_prelevement_obligation = function()
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

                    vm.enregistrer_fiche_suivi_prelevement_obligation(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_suivi_prelevement_obligation = function()
                {
                    if (vm.nouvelle_fiche_suivi_prelevement_obligation) 
                    {
                        
                        vm.all_fiche_suivi_prelevement_obligation.shift();
                        vm.selected_fiche_suivi_prelevement_obligation = {} ;
                        vm.nouvelle_fiche_suivi_prelevement_obligation = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_suivi_prelevement_obligation.$edit) //annuler selection
                        {
                            vm.selected_fiche_suivi_prelevement_obligation.$selected = false;
                            vm.selected_fiche_suivi_prelevement_obligation = {};
                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_obligation.$selected = false;
                            vm.selected_fiche_suivi_prelevement_obligation.$edit = false;
                        
                            vm.selected_fiche_suivi_prelevement_obligation.designation = current_selected_fiche_suivi_prelevement_obligation.designation;  
                            
                            vm.selected_fiche_suivi_prelevement_obligation.respect_obligation = current_selected_fiche_suivi_prelevement_obligation.respect_obligation;  
                            vm.selected_fiche_suivi_prelevement_obligation.observation = current_selected_fiche_suivi_prelevement_obligation.observation;  
                             
                            vm.selected_fiche_suivi_prelevement_obligation = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_suivi_prelevement_obligation = function(etat_suppression)
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
                        id:vm.selected_fiche_suivi_prelevement_obligation.id,
                        id_fspr:vm.selected_identification.id,

                       

                        designation : vm.selected_fiche_suivi_prelevement_obligation.designation ,
                      
                        respect_obligation : vm.selected_fiche_suivi_prelevement_obligation.respect_obligation ,
                        observation : vm.selected_fiche_suivi_prelevement_obligation.observation 
                        
                        
                        
                    });

                    apiFactory.add("fiche_suivi_prelevement_obligation/index",datas, config).success(function (data)
                    {
                    
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_suivi_prelevement_obligation) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_suivi_prelevement_obligation.$edit = false ;
                                vm.selected_fiche_suivi_prelevement_obligation.$selected = false ;
                                vm.selected_fiche_suivi_prelevement_obligation = {} ;
                            }
                            else
                            {
                                vm.all_fiche_suivi_prelevement_obligation = vm.all_fiche_suivi_prelevement_obligation.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_suivi_prelevement_obligation.id;
                                });

                                vm.selected_fiche_suivi_prelevement_obligation = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_suivi_prelevement_obligation.$edit = false ;
                            vm.selected_fiche_suivi_prelevement_obligation.$selected = false ;
                            vm.selected_fiche_suivi_prelevement_obligation.id = String(data.response) ;

                            vm.nouvelle_fiche_suivi_prelevement_obligation = false ;
                            vm.selected_fiche_suivi_prelevement_obligation = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_suivi_prelevement_obligation..
        //FIN fiche_suivi_prelevement_obligation
    }
})();