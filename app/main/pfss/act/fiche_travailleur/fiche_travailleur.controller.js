(function () {
    'use strict';
    angular
        .module('app.pfss.act.fiche_travailleur')
        .controller('fiche_travailleurController', fiche_travailleurController);

    /** @ngInject */
    function fiche_travailleurController(apiFactory, $mdDialog, $scope, serveur_central, $cookieStore, $rootScope, apiUrlExcel) 
    { 
        var vm = this;

        vm.all_commune = [];
        vm.all_village = [];

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


            }
            else {
                vm.identification.zip = "";
                vm.identification.vague = "";
            }

            var repertoire = "fichetravailleur/";
            vm.export_excel = function () {
                vm.affiche_load = true;
                apiFactory.getParamsDynamic("Fiche_travailleur/index?etat_export_excel=" + 1 +
                    "&repertoire=" + repertoire +
                    "&id_ile=" + vm.identification.id_ile +
                    "&id_region=" + vm.identification.id_region +
                    "&id_commune=" + vm.identification.id_commune +
                    "&id_village=" + vm.identification.id_village ).then(function (result) {

                        var nom_file = result.data.nom_file;
                        vm.affiche_load = false;
                        window.location = apiUrlExcel + repertoire + nom_file;


                    });

            }





        });
    }
})();