let json = "{
    "id": "demoCatalogId:DEMO_Crate",
    "labels": {
    "en": "Crate",
    "de": "Kiste"
},
    "parameters": [
    {
        
        "defaultValue": 800,
        "enabled": "true",
        "key": "width",
        "labels": {
            "en": "Width",
            "de": "Breite"
        },
        "type": "Decimal",
        "unitType": "length",
        "validValues": [
            1000
        ],
        "conditionalValues": [
            {
                "value": 800,
                "condition": "(depth == 400)"
            },
            {
                "value": 1200,
                "condition": "(depth != 400)"
            }
        ],
        "visible": "true",
        "visibleInPartList": "true"
    },

   
    {
        "defaultValue": 400,
        "key": "depth",
        "labels": {
            "en": "Depth",
            "de": "Tiefe"
        },
        "type": "Decimal",
        "unitType": "length",
        "validValues": [
            400,
            500,
            600
        ],
        "visible": "true",
        "visibleInPartList": "true"
    },

    
    {
        "defaultValue": 300,
        "key": "height",
        "type": "Decimal",
        "visible": "false",
        "visibleInPartList": "false"
    },

    
    {
        "defaultValue": 10,
        "key": "thickness",
        "type": "Decimal",
        "visible": "false",
        "visibleInPartList": "false"
    },

   
    {
        "defaultValue": "demoCatalogId:wood",
        "enabled": "true",
        "key": "crate_material",
        "labels": {
            "en": "Material",
            "de": "Material"
        },
        "type": "Material",
        "validValues":[
            "demoCatalogId:wood",
            "demoCatalogId:wood_eiche",
            "demoCatalogId:wood_eiche_schwarz"
        ],
        "visible": "true",
        "visibleInPartList": "true"
    },


    {
        "defaultValue": 1,
        "key": "showRightLeg",
        "type": "Decimal",
        "visible": "false",
        "visibleInPartList": "false"
    },
    {
        "defaultValue": 1,
        "key": "showLeftLeg",
        "type": "Decimal",
        "visible": "false",
        "visibleInPartList": "false"
    },
    {
        "defaultValue": 1,
        "type": "Decimal",
        "key": "allowRightDocking",
        "visible": "false",
        "visibleInPartList": "false"
    },
    {
        "defaultValue": 1,
        "type": "Decimal",
        "key": "allowLeftDocking",
        "visible": "false",
        "visibleInPartList": "false"
    }

],
    "subComponents": [],
    "geometry": "
        # Create Bottom
        BeginObjGroup(group_crate_bottom);
            Cube(Vector3f{width, depth, thickness});
            MoveMatrixBy(Vector3f{0,0,height});
            SetObjSurface(crate_material);
        EndObjGroup();

        # Create Front Walls
        BeginObjGroup(group_crate_frontWalls);
            Cube(Vector3f{width, thickness, height});
            MoveMatrixBy(Vector3f{0,0,height});
            SetObjSurface(crate_material);
            Copy();
            MoveMatrixBy(Vector3f{0,depth-thickness,0});
            SetObjSurface(crate_material);
        EndObjGroup();

        # Create Aside Walls
        BeginObjGroup(group_crate_AsideWalls);
            Cube(Vector3f{thickness, depth, height});
            MoveMatrixBy(Vector3f{0,0,height});
            SetObjSurface(crate_material);
            Copy();
            MoveMatrixBy(Vector3f{width-thickness,0,0});
            SetObjSurface(crate_material);
        EndObjGroup();
        ",
    "parentDockings": {
    "points": [
        {
            "position": "{0,0,0}",
            "mask": "demoCatalogId:PedestalToTableLeft",
            "selfAssignments": {
                "onDock": {
                    "showLeftLeg": "1"
                },
                "onUnDock": {
                    "showLeftLeg": "0"
                },
                "onUpdate": {
                    "showLeftLeg": "0"
                }
            },
            "rotation": "{0,0,0}",
            "condition": "(allowLeftDocking == 1)"
        },
        {
            "position": "{width,0,0}",
            "mask": "demoCatalogId:PedestalToTableRight",
            "selfAssignments": {
                "onDock": {
                    "showleftLeg": "0"
                },
                "onUnDock": {
                    "showLeftLeg": "1"
                },
                "onUpdate": {
                    "showLeftLeg": "0"
                }
            },
            "rotation": "{0,0,0}",
            "condition": "(allowRightDocking == 1)"
        },
        {
            "position": "{width,0,0}",
            "mask": "demoCatalogId:TableToTable",
            "rotation": "{0,0,0}"
        }
    ]
},
    "childDockings": {
    "points": [
        {
            "position": "{0,0,0}",
            "mask": "demoCatalogId:TableToTable",
            "rotation": "{0,0,0}"
        }
    ]
},
    "pricing": [
    {
        "region": "default",
        "currency": "EUR",
        "price": "1000"
    }
],
    "possibleChildren": [
    {
        "itemId":"demoCatalogId:DEMO_Desk"
    }
]
}";
return json;