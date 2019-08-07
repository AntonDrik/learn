# Roomle Scripting: First Steps
Version August 2019
Author: Jiří Polcar (jiri.polcar at roomle.com)

## Disclaimer
This manual is for Roomle's and external content teams only. Only members of Roomle or members of external content teams are allowed to have this manual and no one is allowed to hand it over to a person that is not a member of any of such teams.

This manual is a living product which is constantly updated as new good practices of work are invented or as new features of the Roomle kernel or configurator sites are implemented.

If you have any questions or difficulties, feel free to contact your Script Lead at Roomle. We will be glad to help you out.

If you find anything in this manual that is hard to understand, jiri.polcar at roomle will be glad to read your feedback.

## Annotation
This document is intended to be a starting point Roomle scripters. Tutorials and best practices for writing component scripts for the Roomle Configurator are included.

# Table of Contents

* [Introduction](#introduction)
* [Setting-Up the Environment](#setting-up-the-environment)
* [First Example](#first-example)

# Introduction
In Roomle Floor Planner, you can place *Items*, which are composed of one *Component* with preconfigured *Parameters* or more *Components* that are connected via *Dockings* together.

In this manual, we will start with the *Component*. A *Component* is defined by a JSON (JavaScript Object Notation) data structure, which is saved in the Roomle Product Data Cloud (Roomle PDC, PDC), where it will be fetched by the floor planner or the configurator, or is saved in a .json file on your disk while you're working on it.

In the *Configurator*, as an end-user you can interact with the component by rotating the view around it and you have a user interface at your disposal, which will allow you to pick values from the component's *Parameters*, like size, color etc. or you can dock (add) other components or item to your configuration. After you've docked other components, you can drag them around, undock them and place them to some other *Docking*.

When you are satisfied with your components in the configurator, you can save the *Configuration* you just made and use it further. You can share it with other people, send it to the e-shop for placing an order or you can place it in your floor plan in the Roomle Floor Planner. 

To create a *Component*, you need not only to write the JSON file. You also need *Materials* (textures) that you will apply on *Geometry*. The *Materials* are not defined inside the *Component*, but they are stored externally in the PDC and are refered by unique *materialIds* in your script. As for *Geometry*, there are three ways to make it. You can use functions to create primitive geometry shapes (*Primitives*), you can load *External Meshes*, which are also stored in PDC or you can define *Internal Meshes* directly in the JSON script.

All of these elements of the configurable products are stored in the PDC. To bring some order into it, everything is stored in *Catalogues*, that usually contain product data of one manufacturer or one product line (depending on the deal with our end-customer). To limit access to the *Catalogues* in the PDC, there are *Tenant* accounts that have access only to some of the catalogues.

---
# Part 1: Scripting Basics

## Setting-Up the Environment

To set-up your environment, please refer to the Environment Setup document.

To use the configurators to test your work, they are browser applications. The main test site, the *High Speed Configurator Test Site* (or *the HSC test site*) is under [this link][Glimmer].

## First Steps
In this chapter, we are going together to write a minimally working script that will show something (consider this a Hello World example) and learn how to display the result. Then, we will get a little more complexity by making a table with parametrizable dimensions.

### Minimal Component Example
To begin with scripting, make a new file in your code editor and save it as .json, so that the editor recognizes correctly the format and will help you with formatting the file structure. If you have VS Code with our code snippets installed, you can start typing:

`roomleComponentSimple`

NOTE: All snippet that target the JSON sctructures begin with a 'roomle' prefix (which is not the case for the snippets targeting geometry, onUpdate etc. scripts).

The editor will offer a snippet with matching name, which you can select and it will write the content of the snippet for you:

~~~~
{    
    "id":"this will be prefiled based on your folder and file name",
    "parameters":[],
    "onUpdate":"",
    "geometry":"AddCube(Vector3f{1000,1000,1000});",
    "articleNr":""
}
~~~~

To be really minimal, let's change this to just:

~~~~
{
    "id":"demoCatalogId:part1_firststep",
    "geometry":"AddCube(Vector3f{1000,1000,1000});"
}
~~~~

In the next chapter, we will see how to get this code working.

### Testing the Component

~~~~Now, we can copy the code and go with it to the [HSC test site][Glimmer]. Here, in the right part of the screen, you can click to unfold Component, where you paste the source code of the above script and press *Load into Kernel*. This will begin parsing the data from the text input and if no component is loaded, it will display the component. If you do any changes to the code, reload the page and repeat the process.~~~~ (note: as of August 2019, this is not working).

In the EnvironmentSetup.md document, refer to the chapter *Loading Component Definitions from Local Drive* to see, how to load the component in the test site. Do not worry about braking anything in this step, you are dealing only with the test site data, which will not affect anything in our databases.

The contents of this scripts are minimal: it contains only *id* and *geometry* field. The really minimal necessity every script needs is the *id*. In context of component, we refer to it as *componentId*. This is a unique identifier in the database (or the database key). It is a string that consists of two parts divided by colon (:). The first part is the *catalogueId* and the other part is the id of the component in the *Catalogue*.

The *geometry* field contains the geometry script (see Roomle Configuration Catalog Structure Format document) and contains variables, computations and geometry function that allow the kernel to process the geometry and to feed the necessary data to the viewing page to render it.

In the [HSC test site][Glimmer], you can also load the *Component* by its *Configuration*. Click to unfold the Configuration field and paste following code there:

~~~~
{"componentId": "demoCatalogId:Placeholder_Cube"}
~~~~

This also a JSON structure, which, after pressing *Load configuration* button, will load the Placeholder_Cube *Component* from demoCatalogId *Catalogue*.

Using this approach, you can load any *Component* that is accessible by the *Kernel*. You can even overwrite *Component* definitions without affecting any live data with the database - everything what happens in the test site will be reset when you reload the whole page. If load more components in the test site, you can switch between them using the above configuration snippet and load them by their *compnentId*s. 

### Parameters
To have really configurable products, we need to allow the end users to interact with the current model they are looking at. One of the ways to allow the user to interact with the models are the *Parameters*. Parameters can be of different data types (more on that later), they can have also various kinds of values representation. 

Let's add Depth and Width parameters into our previous code.

~~~~
{
    "id":"demoCatalogId:part1_firstStep",
    "parameters" : [
        {
            "key":"width",
            "type":"Decimal",
        	"unitType":"length",
            "defaultValue":1000,
            "validValues":[800,1000,1200],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"depth",
            "type":"Decimal",
        	"unitType":"length",
            "defaultValue":600,
            "validValues":[600,700],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ],
    "geometry":"AddCube(Vector3f{width,depth,1000});"
}
~~~~

Here, we defined two parameters of type Decimal (we'll get into it more detailed in part 2, for now - it states that this parameter can hold decimal numbers, like 0.5). When you load the *Component*, the *defaultValues* will be selected at start. The *length* *unitType* will display the values in centimeters instead of plain numbers (if you delete the unitType line, you get for example 600.00). The valid values are a plain list of values the user can select. The most important entry in every parameter is the *key* (which you see specifies how you will refer to it and must be unique in context of one *Component*). The other important is the *type* which specifies what will be stored inside.

In the *geometry* script, you can see that the AddCube function now uses the values from parameters instead of the previous numeric constants.

**IMPORTANT:** Parameter KEYS ARE CASE SENSITIVE. That means, if the *key* is width and you use Width in the AddCube function, it will not work.

### Article Numbers

Article numbers are unique product/SKU specifier in the context of the shop we are doing the configurator for. In a *Component*, we can specify one unique *articleNr* or use an *Expression* or *Script* so that one *Component* can hold more of them.

We can specify a constant *articleNr* in the component adding this:

~~~~
{
    "id": "some id",
    ...
    "articleNr" = "'A-320-XY'" or "'1600'" or "'type here what you want'"
}
~~~~

In the HSC Test site, you can test this *Component*, then you can unfold *Interactions* section, where you will find *Open partlist* button, where you can check the article number.

NOTE, that the apostrophes that enclose the 'value'. They specify, that the value inside is a *string*. In other words, the *articleNr* value will be exactly what is enclosed. If you didn't use it and had parameteters with key of A and XY, it would try to compute the *articleNr* like (value of A) minus (320) minus (value of XY). In the other case, it would parse 1600 as a number, it would be read in default as a *Decimal* type, which would result in 1600.00 (numbers display two decimal places). By enclosing the numbers in apostrophes, you make sure that you get 1600.

This is how you can go with a constant *articleNr* per *Component*. You can also use articleNrs like expressions. The vertical line character | is used for connecting two string values together (= string concatenate operator):

~~~~
    "articleNr": "'BX' | width | "-" | depth"
~~~~

You can also script an article number logic in *RoomleScript* using conditional statements. These will be deeper explained further in this document.

~~~~
    "articleNr": "
        articleNr = 'BX';
        if (Width == 800) { articleNr = articleNr | '08'; }
        if (Width == 1000) { articleNr = articleNr | '10'; }
        if (Width == 1200) { articleNr = articleNr | '12'; }
        articleNr = articleNr | '-';
        if (Depth == 600) { articleNr = articleNr | '6'; }
        if (Depth == 700) { articleNr = articleNr | '7'; }
    "
~~~~

This will set *articleNr* to 'BX', then is added the width part according to the width value. Then the letter 'x' is added and then the depth part. Result will look someting like 'BX12x7'.

NOTE: Contrary to the valid JSON format, you can make a new line in the value part of the JSON assignments. This will, unfortunately, break the JSON validation mechanism in the code editor. In current state, existence of a code editor supporting multi-line JSON value is unknown, but we have created a formating plugin for our JSON files.

**IMPORTANT:** The *articleNrs* must be handled with care: If there is even the slightest imperfection, the customer will get a wrong thing for a wrong price (or nothing at all), meaning it is imperative that the *articleNrs* must work exactly in accordance with the product definition, including white spaces.

### Basic Geometry Functions

In the *geometry script*, you can use functions that can draw different types of geometry and transform them. Let's see some of the basic functions. For all of them, please refer to the *Roomle Configuration Catalogue Structure Format* document. We will now learn to use some of the basic ones for the next example. All of them are also prepared in the code snippets.

All functions, that will draw the geometry begin with Add prefix, which will help you with use of the code snippets. These functions will draw primitive shapes or defined meshes. Here, we will see how to draw a cube and a cylinder:

~~~~
AddCube(Vector3f{100,100,100});
~~~~

This will draw a primitive cube with slightly rounded edges (for sharp edges, just replace the function identifier with *AddPlainCube*) with the origin in the rear left bottom corner and with 100x100x100 mm dimensions.

~~~~
AddCylinder(radiusBottom, radiusTop, height, circleSegments);
AddCylinder(100, 100, 500, 16);
~~~~

This will draw a cylinder with a radius of 100 mm, 500 mm height with the origin in the bottom center. You can see that you can also have more like a cone-shaped cylinder if you use different top and botom radii. The circleSegments argument means how many faces will the cylinder have, because most of the 3D graphics in general is made from elementary triangles, which approximate curved shapes. How many circleSegments is optimal to use depends on the situation: the size of the cylinder, the size of whole model, viewing distance and also how important the particular cylinder is. The more segments the smoother, but also more GPU demanding, which must be taken into account because our *Configurator* apps target also mobile devices.

NOTE: Most Add-Geometry functions have overloads to modify the UV mapping of the materials. See the *Roomle Configuration Catalogue Structure Format* document for further details.

**IMPORTANT:** Roomle's **coordinate system** has X to the right, Y forward and **Z up** and is **left-handed** (meaning rotating along the axis has a left orientation). The unit is **milimeter**.

After drawing a mesh, we always need to set a *Material* for the object surface. The *Material* is stored in the *Materials* section of the PDC and is refered to with a *materialId*, which has the same structure as the *componentId*:

~~~~
SetObjSurface('catalogueId:materialId');
~~~~

The SetObjSurface is one of the geometry modifier functions and will always apply to the current geometry object or group, which is in the current state of the kernel always the last one. Further such functions are the translation and rotation functions:

~~~~
MoveMatrixBy(Vector3f{100,0,0});
RotateMatrixBy(Vector3f{0,0,1},Vector3f{0,0,0},90);
~~~~

The first function will move the current object or group by 100mm to the right. The second function will rotate. The first vector value is the direction of the rotation axis. The second vector is the origin of the axis (a point in 3D space which is an element of the axis) and the last value is 90 degrees. The axis is pointing up and the object will be rotated 90 degrees to the left.

NOTE: To help undestand the handness of the coordinate system and the rotations, point with the thumb of your left hand in the direction of the rotation axis. The direction of the rotation will then follow your fingers. 

You will often need to apply these modifier functions to a group of objects. You can create such groups like this:

~~~~
BeginObjGroup('NON-MANDATORY_GROUP_NAME');
    /* everything in the group belongs here */
    AddCylinder(20, 20, 500, 16);    
      SetObjSurface('catalogueId:materialId2');
    AddCube(Vector3f{100,100,100});
      SetObjSurface('catalogueId:materialId1');
      MoveMatrixBy(Vector3f{-50,-50,500});    
EndObjGroup();
/* move the whole group */
MoveMatrixBy(Vector3f{-50,-50,0});
~~~~

Here, we add a thin long cylinder and a cube on top of it (resulting in something like a hammer). This whole is wrapped in the Begin/EndObjGroup functions. The last translation function will move this whole group at once. You can also apply SetObjSurface to everything in the group.

You can leave the *BeginObjGroup* arguments empty by using just (). Currently the string functioning as the group name does not have any function and you can write anything there as long as you enclose this in 'apostrophes'. We recommend using capital letters for group naming, so that they are more more visible. In complex scripts, please always use matching names in both BeginObjGroup and EndObjGroup functions. 

There are also comments enclosed in /\* \*/. Everything inside a comment will be ignored and serves you as a code-organizing feature or to make notes. Comments are valid only for *scripts*, not the JSON structure!

Note: Although our engine supports // one line style comments, please do not use them as they break offline loading of the components. Our formatter will convert them to /* */ comments automatically if some are present in the scripts.

The last often used modifier function is the Copy function. It will take the current object or group and make an exact copy of it, including position and rotation. The usage is as simple as:

~~~~
Copy();
~~~~

**IMPORTANT:** Notice, that we are **indenting** the content of the group. This is an absolute necessity: when your script grows more complex, you will find out that you really need to organize the code. We also like to indent the modifier functions by one place to see them more clearly. This is what our formater does for you.

### Example: Parametrized Table
Using the functions we learned in previous chapters, we will now create a parametrized table. We already have the width and Depth parameters for the previous example and we will be working in the *geometry script*. The 

~~~~
{
    "id":"demoCatalogId:DEMO_Desk",
    "parameters" : [
        {
            "key":"width",
            "type":"Decimal",
        	"unitType":"length",
            "defaultValue":1000,
            "validValues":[800,1000,1200],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"depth",
            "type":"Decimal",
        	"unitType":"length",
            "defaultValue":600,
            "validValues":[600,700],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ],
    "geometry":"
        /* we will be working here */ 
    ",
    "articleNr": "
        articleNr = 'BX';
        if (width == 800) { articleNr = articleNr | '08'; }
        if (width == 1000) { articleNr = articleNr | '10'; }
        if (width == 1200) { articleNr = articleNr | '12'; }
        articleNr = articleNr | '-';
        if (depth == 600) { articleNr = articleNr | '6'; }
        if (depth == 700) { articleNr = articleNr | '7'; }
    "
}
~~~~

The table surface is in standard height of 71 cm, made of wood with a thickness of 3 cm. The legs have a diameter of 5 cm, a chrome surface and a black plastic end-cap. The distance of the leg's center from the corner (X and Y, not diagonal) will be 5 cm.

We will begin with the desk top surface:

~~~~
AddCube(Vector3f{width,depth,30});
  SetObjSurface('demoCatalogId:wood');
  MoveMatrixBy(Vector3f{0,0,680});  
~~~~

Because there is always one material per mesh, we will create the leg and end-cap as separate cylinders. To manipulate with them easily, we will group them and then we move the leg those 5 cm behind the edge of the table.

~~~~
BeginObjGroup('LEG');
    AddCylinder(25, 25, 10, 12);
      SetObjSurface('demoCatalogId:6K');
    AddCylinder(25, 25, 670, 12);
      SetObjSurface('demoCatalogId:6K');
      MoveMatrixBy(Vector3f{0,0,10});
EndObjGroup();    
MoveMatrixBy(Vector3f{50,50,0});
~~~~

It is time to copy and move the leg three times. The copy will always be created on the exact place of the copied leg. The first leg is in rear right corner. We move the second to the right rear corner, then forward and the last one to the front left corner.

~~~~
Copy();
MoveMatrixBy(Vector3f{width - 2*50,0,0});

Copy();
MoveMatrixBy(Vector3f{0,depth - 2*50,0});

Copy();
MoveMatrixBy(Vector3f{-width + 2*50,0,0});
~~~~

Note: A good practice would be to have th 50 as an internal variable or parameter. For simplification, we use it directly here.

The resulting table should be looking like this:

![alt text](images/part1_tableExample1.png)

<details>
<summary>Unfold to see the final source code</summary>

~~~~
{
    "id": "demoCatalogId:Examples_Desk",
    "parameters": [
        {
            "key": "width",
            "type": "Decimal",
            "unitType": "length",
            "defaultValue": 1000,
            "validValues": [
                800,
                1000,
                1200
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key": "depth",
            "type": "Decimal",
            "unitType": "length",
            "defaultValue": 600,
            "validValues": [
                600,
                700
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ],
    "geometry": "
        AddCube(Vector3f{width,depth,30});
          SetObjSurface('demoCatalogId:wood');
          MoveMatrixBy(Vector3f{0,0,680}); 
          
        BeginObjGroup('LEG');
            AddCylinder(25, 25, 10, 12);
              SetObjSurface('demoCatalogId:6K');
            AddCylinder(25, 25, 670, 12);
              SetObjSurface('demoCatalogId:chrome');
              MoveMatrixBy(Vector3f{0,0,10});
        EndObjGroup();    
        MoveMatrixBy(Vector3f{50,50,0}); 

        Copy();
        MoveMatrixBy(Vector3f{width - 2*50,0,0});

        Copy();
        MoveMatrixBy(Vector3f{0,depth - 2*50,0});

        Copy();
        MoveMatrixBy(Vector3f{-width + 2*50,0,0});
    ",
    "articleNr":"
        articleNr = 'BX';
        if (width == 800) { articleNr = articleNr | '08'; }
        if (width == 1000) { articleNr = articleNr | '10'; }
        if (width == 1200) { articleNr = articleNr | '12'; }
        articleNr = articleNr | '-';
        if (depth == 600) { articleNr = articleNr | '6'; }
        if (depth == 700) { articleNr = articleNr | '7'; }
    "
}
~~~~
</details>

### Conclusion
In the first steps chapters, we learned how to set up the scripting environment, about the basics of the scripting job: what is a *Component* and how to write it so that it results in a interactive model of a table with *Parameters*. We learned basic geometry *RoomleScript* funcitons and how to use them and also how to compute *Article Numbers* of the product we are creating the configurator for.

---
## Very Basic RoomleScript Introduction
In the scripting reference section Roomle Configuration Catalog Structure Format document you can find the JSON objects structures, which contain information about the *key* and *type* of the *key*. If the *type* is *Script*, you can write *RoomleScript* in quotes. To be able to write RoomleScript, let's see some basics. Note, that almost everything from the reference configurations is prepared in the VS Code snippets.

**IMPORTANT:** Everything in this chapter about *RoomleScript* applies only for *Script* values in the JSON structure (= eveything in quotes on the right side of the JSON attributes and of Script type => "key" : Script ) - not the JSON structure itself!

The syntax of *RoomleScript* is very similar to JavaScript, although is much more limited. Keep in mind, please, that the scripts are intended to be simple, although from time to time, a project requiring a more complex coding job occurs. In such cases, don't hesitate to consult with us. If you feel something you'd like to have is missing, we will be glad to hear about your feature requests.

The central part of scripting in a *Component* is usually the main *onUpdate* script. It is intended to compute internal variables and helper values that will be further used in *dockings*, *geometry*, *articleNr* for further use and is called whenever something changes. The *Geometry* scripts calls follow and they are intended for drawing the 3D output and special geometry functions are available only there. It is also good place for computing the values that will be used only in the *geometry* script. *ArticleNr* are called on opening the part list. The last type of scripts are the docking assignment scripts, that control connecting of multiple components together.

### Expressions, Variables and Values
To create expressions, you can do it in a very similar way like in JavaScript. See following table with available operators 

|operator|meaning|
|---|---|
|+|addition|
|-|subtraction|
|*|multiplication|
|/|division*|
|\||string concatenation|
|&&|logical AND|
|\|\||logical OR|
|==|equation / is equal|
|!=|is not equal|
|=|assignment|

*Notice that this is the slash (/), not the backslash (\\)

There are no keywords for declaring internal variables. You simply do:

~~~~
area = width * depth;
~~~~

It will first search for a *Parameter* or existing internal variable. If neither is found, it will declare an internal variable called *area* and assign the result of the expression to it. Watch out as this is prone to typos in your code. Keep in mind, that when using any internal vars, you need to have them declared by the time you will be using them:

~~~~
area = width * depth;
...
volume = area * height; /* If area was not declared before, it would crash here.*/
~~~~

The variable declarations made in onUpdate scripts are declared in the whole component. It can also happen that the variable you are using will not be declared in the first update-loop, but later. Therefore, you must be always sure that your variables are declared and initialized in any configuration with the parameters and docked components declaring the current state.

If the variable identificator has not been declared, in expressions the undeclared identificator will be interpreted as a string value. The following code can return either K-100-area or something like K-100-385.461, depending on whether the area has already been declared or not:

~~~~
"articleNr": "'K-100-' | area"
~~~~

This means, although we DO NOT RECOMMEND it, you are "also allowed to" forget apostrophes enclosing string values like in the following example.

~~~~
"parameters":{
    "key": "handle",
    "validValues: ["with", "without"],
    ...
}
...
if (handle == with)

/* we DON'T RECOMMEND not using apostrophes enclosing string, because after some time, feedback or change requierment comes and can hapen: */

...
with = true;    /* declaring a helper variable I'm going to use later */
...
if (handle == with) { ... }
...
~~~~
In the previous exmaple, consider having a parameter Handle with possible values 'with' and 'without' (which is, by the way, against best practices described further). If you declare somewhere a helper var that you're calling *with*, you will be comparing (handle == true), which probably is not the expected case you should get into.

NOTE: Further in this document, you will read a *Parameter* best practices instrucitons chapter, where you'll find, that you should actually use a boolean with the name hasHandle instead of Handle = with/without.

You do not have to assign a data type, that will be done automatically. Also, conversion between floats (decimals) and integers happens automatically and you do not have to explicitly cast (= convert by yourself) betweem them. As opposed to programming languages, something like this is safe to do:

~~~~
a = 4.5;
b = 1.5;
if ( a == (b*3) ) { ... }
~~~~

Boolean values are implicitly converted between 1/0 and true/false. This means you can use an Integer-type *Parameter* with values 0 and 1 and use it like a Boolean and even make something like:

~~~~
if (hasLegs) {
    dockHeight = height + legHeight;
} else {
    dockHeight = height + 120;
}

/* you can save a few lines of code and one internal variable declaration by: */

dockHeight = height + (hasLegs == true) * legHeight + (hasLegs == false) * 120;

/*
This is what happens:
dockHeight = Height + (true == true) * legHeight + (true == false) * 120;
dockHeight = Height + (true) * legHeight + (false) * 120;
dockHeight = Height + (1) * legHeight + (0) * 120;
*/
~~~~

You can compute the dockHeight anywhere directly with avoiding to pre-compute it in onUpdate. You should reconsider using such simplification in cases where you make such computation repeatedly, because too much computations can take resources away and mainly is bad for code maintenance (if there is a change, you could end up in need to update it at a lot of places in the script). Also, keep the script maintainable and readable and avoid using too complex statements.

### Comments
If you need to leave some notes in the code, which is a good practice, you can use C-like syntax comments, either a single-line comment // or multi-line comments /* */:

~~~~
/* this is a single line comment */

// this is also a comment
// everything until end of this line will be skipped
// but as of May 2019, 
// comments break Load in the Kernel option in testing page
// as well as the offline loader script

/*
This is a multiline comment.
----------------------------
You can write a lot here, but keep in mind, that you should be calling your variables and organize your code in a way which will not require to use such long comments.
*/ 
~~~~

You can also disable pieces of your code using /* \*/ comments for debugging. Keep in mind, that you shouldn't leave such code in the final version of the script. Also note, that /* \*/ comments can not be nested.

IMPORTANT: Use strictly these two types of comments, never use something like /** **/ or //********// etc. 


### Branching: If
There are many needs to branch a code. For example, we want to draw a handle if the *Component* has a hasHandle *Parameter* set to true. In this case, we need to use code branching, for which we have the *if* statement:
~~~~
if (booleanExpression) {
    /* if booleanExpression is true, it will enter in these braces */
}
/* If booleanExpression is not true, it will skip the code in the braces and go directly here instead of going into the braces first. */
~~~~

You can also use an *if-else* statement:
~~~~
if (booleanExpression) {
    /* If the booleanExpression is true, it will do this. */
} else {
    /* Otherwise, it will do this. */
}
/* The code will continue here no matter what booleanExpression was. */ 
~~~~

Do not:
~~~~
if (booleanExpression) {
    /* If the booleanExpression is true, it will do this. */
} 
if (!booleanExpression) {
    /* If the booleanExpression is false, it will do this. It'll work, but you should use else instead. Keep in mind that if you set booleanExpression from true to false in the previous block, you will get also here. */
}
~~~~

**IMPORTANT:** **{ and } braces** enclosing *if* and *if-else* statements **are mandatory** even in cases where other languages wouldn't require them.

### Cycle: For

The *RoomleScript* has one cycle available, which is the *for* cycle. This cycle is best suitable for cases where you know how many loops of the cycle you are going to do. The basic syntax is:

~~~~
for (i = 0; i < loopsCount; i++) {
    /* the code in the cycle */
}
~~~~

This will declare a variable i, will check if i < loopsCount and if so, it will enter the code block and then increment i by one. As in other languages, you can modify the initialization, condition and increment part to your liking. You can for example:

~~~~
continue = true;
for (i = 5; i < loopsCount && continue; i = i + offsetPositions) { 
    /* the code in the cycle */ 
    ...
    continue = false;
    /* you can use something like this instead of break; */
}
~~~~

Note: As of 2019, there is no while or do cycle in RoomleScript.

---
## Parameters
In this chapter, we will learn details about *Parameters* and best practices on how to use them. You will be introduced to their data types, naming conventions and parameter logic.

The *Configurator* always displays the *Parameter* of the selected *Component*. If no *Component* is selected, the *Parameters* of the root *Component* are displayed. If there are some *global* parameters and nothing is selected, all global parameters are displayed and they are assigned to *Components* in the *Configuration*.

**IMPORTANT:** In *Configurations*, *Parameters'* values are saved. All other values and internal variables must be always dependent on one actual set of *Parameters'* values and can not be dependend on any of previous values, as the previous states are not saved. This means for you, that you must ensure that all the values can be computed properly and all conditional paths must be always reachable.

Let's look at the parameter and its attributes:

~~~~
{
    "key": "identifier",
    "sort":1,
    "group":"default",
    "labels": {
        "en": "Label",
        "de": "Beschriftung"
    },
    "type": "Integer",
    "global": false,    
    "defaultValue": 0,
    "validValues": [0, 1, 2],    
    "highlighted": "false",
    "enabled": "true",
    "visible": "true",
    "visibleAsGlobal": "false",
    "visibleInPartList": "false",
    "onValueChange": "otherParameter = thisParameter * yetAnotherParameter + 5"
}
~~~~

* **key** A unique identifier you will be using to refer to the values of this *Parameter*. Use camelCase, do not use PascalCase, do not use underlines_to_separate_words.
* **sort** By default, the order of displayed *Parameters* matches the order in the JSON. You can override this by putting integer values, the lowest value is on the top.
* **labels** The label of the *Parameter* in the *Configurator* UI. You can use different languages. If there is no label, the key is used.
* **type** The value type of this *Parameter*. Can be: Boolean, Integer, Decimal, String, Material
* **unitType** Sets a special behaviour in representation of the values.
* **global** Whether this *Parameter* is *global* (see beginning of the chapter about displaying parameters, also will be further explained later).
* **defaultValue** The value this *Parameter* will have in its default state. If the value is invalid (further in *valueObjects*), it will be overriden.
* **highlighted**
* **enabled** If this is evaluated as false, the UI control will be greyed out and the user won't be able to interact with this component.
* **visible** Whether is visible or hidden as local *Parameter* = when the component is selected.
* **visibleAsGlobal** If this *Parameter* is *global*, determines whether it will be visible if nothing is selected.
* **visibleInPartList** Whether this is visible as a part list entry.
* **onValueChange** Can assign different values to other *Parameters*. This is and advanced thing and should be used only when you know what you're doing, as this is not fired on *Configuration* load.

### Parameter Types, Data Types and Unit Types
*RoomleScript* uses these basic data types: *Integer*, *Decimal*, *Boolean* and *String*. *Integral* values contain whole numbers, like 1, 0, -5, 100 etc. *Decimals* have decimal spaces like 1.75, 3.1415, -4641.156. Decimal delimiter is point. Booleans store true or false values as 1 and 0. *Strings* contain text and *String* values are enclosed in 'apostrophes' (so that they don't collide with the JSON's quotes).

The *type* key in a *Parameter* is not the same as a data type. Description of *RoomleScript* parameter types follows.

* **Boolean** A checkbox UI control with the Parameter-level lebel next to it. The value which is stored is 1 for *true* and 0 for *false*.
* **Integer** A button UI control where the Parameter holds Integer values.
* **Decimal** A button UI control where the Parameter holds Decimal values. The values labels will have two decimal places displayed (for example 100.00).
* **String** A button UI control where the Parameter holds String values. The labels are matching the values.
* **Material** A material thumbnail + viewable name list UI control from the material database. The values are the *materialIds* or *materials categoryIds* and the data type of the values is *String*.



![alt text](images/part1_parameterTypes.png)

<details>
<summary>Unfold to see source code that generated these parameters.</summary>

~~~~
{
    "id": "demoCatalogId:parameters_test",
    "parameters":[
        {
            "key":"boolean",
            "type":"Boolean",        	
            "defaultValue":0,
            "validValues":[
                1,
                0
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"integer",
            "type":"Integer",        	
            "defaultValue":1,
            "validValues":[1,
                2,
                3
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"decimal",
            "type":"Decimal",        	
            "defaultValue":0,
            "validValues":[1,
                135.25,
                0
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"string",
            "type":"String",        	
            "defaultValue":"some value",
            "validValues":[
                "some value", 
                "another value"
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key":"material",
            "type":"Material",        	
            "defaultValue":"demoCatalogId:referenz_chrome",
            "validValues":[
                "demoCatalogId:wood", 
                "demoCatalogId:reference_chrome"
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ]
}
~~~~
</details>

### Declaring Internal Variables and Constants

There are many cases where you need to only declare a variable and assign an initial value to it or to prepare the identifiers so that they will be used without crashing. For example, you can have a count of docked pillows to a sofa. If you increment pillows count by one everytime you dock a pillow, you need the pillowCount declared and initialized. Another use case are some helper constants you will be using throughout the geometry function, like thickness of the wall. For this, following code in the beginning of onUpdate function is the best place:

~~~~
    if(ifnull(inited, false) == false) {
        inited = true;
        pillowsCount = 0;
        wallThickness = 200;
    }
~~~~

In this code, the `ifnull(identifier, valueIfNull)` function checks whether an identifier has already been declared. If not, it returns the *false* value (value returned if the identifier is *null* = undeclared). Because *inited* has not been initialized, the ifnull returns *false*, which compares to *false* resulting in *true* equation, thus entering the code block, there we declare *inited*, so that it does not enter the block next time. In the block, we also declare and initialize our variables and constants.

It is not absolutely necessary to declare constant like this, but it saves computing power by initializing them only once. As for *pillowCount*, we would need to either declare a *Parameter* (which is unnecessary as it is not an input) or we could end up by always setting it to zero and wondering why our pillow counter is not working.

### Choosing the Correct Parameter, Unit Type and Parameter Key
Choosing a correct *Parameter* type is essential for a properly working script and UI. As well as in programming languages, computation with different data types bring different CPU requirements and also some specifics. For a correct choice, you can ask such questions regarding the state of the object that needs to be represender by the *Parameter*:

* Is it a yes/no or has/hasn't option?
* How many options are there?
* Can it be represented by a number?
* Is it some kind of direction?

#### Boolean Parameters

If it does mean yes or no, has or hasn't, there are two possibilities, which generally lead to the Boolean data type. However, if the type of the parameter is Boolean, there will be a checkbox UI. True and false values are internally stored as 0 and 1, which means, you can easily replace such parameter with an Integer type to display twe two buttons UI control, but still use it in exactly the same way as you would use a Boolean. See chapter about values and expressions. `TODO: LINK`

#### Other Uses of Dual-Value Parameters and Direction Parameters

Also, wherever there are only two options, consider using a Boolean or Integer with validValues of 0 and 1. If you can not figure a correct name for the key that refers to i situation that is *is a (...)* or it *has a (...)*, you can try calling it like something, that refers to something positive or negative. Then, the values might be -1 and +1 (and possible 0 for neutral value, like *in center*). A typical example is **direction**, where you should keep this **convention**:

|Axis|Direction Name|Positive Direction|Negative Direction|
|---|---|---|---|
|X|Width|Right|Left|
|Y|Depth|Forward|Backward|
|Z|Height|Up|Down|
|X|RotationX/Pitch|Clockwise|Counter-clockwise|
|Y|RotationY/Roll|Clockwise|Counter-clockwise|
|Z|RotationX/Yaw|Clockwise|Counter-clockwise|

Note: Rotation directions follows the left-hand rule as we are in a left-hand coordinate system. That means: Point the thumb of your left hand in the direction of the according axis, your fingers will then wrap in the positive direction.

For example, you can have a piece of furniture, that is made in two symmetric left and right variants, to which you can attach a small door. If you have the pivot of the *Component* in the center bottom, you can compute the dockpoints coordinate and also use it as a condition (in case the centered option shouldn't have the door):

~~~~
"parentDockings": {
    "points":[
        {
            "mask": "smalldoor",
            "position": "{Side * Width/2, 300, handlePositionZ}",
            "condition": "Side != 0"
        }
    ]
}
~~~~

### When to Use Internal Variables and When Parameters

The rule of thumb is to use *Parameters* for values, that are to be chosen by the end-user of the configurator. Those are the product parameters that the user wants to customize, like upholstery material, size variant, accessories etc. Ideally, between Parameteres should be only those variables, that are used for user's input and the helper variables computed from these parameters (like dockWidth, hasRightDockpoint) or the status of the configuration after docking (like isLeftChild, hasRightParent) should be declared in onUpdate as internal variables. However, there are cases where we need to or it is better to expose the internal variables as *Parameters* that will not be visible.

The reasons for exposing the internal vars as parameters are:
* You need to assign or supersede the value to/from a *SubComponent*.
* You want to have a same component for different product types, where you do not want the users to change between them and hide the option from the users.
* You need to debug the parameters and let them view in a display in the UI (but delete them from final version)

### Naming and Values Conventions Summary

This table is here to sum up the conventions, that were described in previous chapters, in examples:
|Purpose|Suggested Key|Suggested Values or Type|
|---|---|---|
|Specifies whether this component has legs|HasLegs|Boolean/Integer {0,1}|
|Specifies the type of legs this component has|LegsType|String, values similar to SKUs + "0" as none|
|Specifies whether this is a corner part|IsCorner|Boolean/Integer {0,1}|
|Specifies if the component is docked as a left child|isLeftChild|Boolean|
|Specifies how many levels a shelf has|ShelfCount|Integer {3,4,5,...}|
|Specifies the size of the component|Size|Decimal with dimensions values, if non-appliable, then according to the product catalogue, like 'S','M','L'|
|Specifies on which side this is docked|dockedSide / side|Integer {-1,0,1} (left,root/center/NA,right)|
|Pick the sofa element type (straight, corner, longchair ...)|ElementType|String, values similar to SKUs or abbreviation|
|Dimensions|Width, Depth, Height, Length|Decimal|
|The main material|Material|Material|
|Secondary or complementary material|Material2|Material|
|Material of the contrast thread|MaterialThread|Material|
|Legs material|MaterialLegs|Material|

As for the letter cases, for *Parameters* that are intended to be used in the end-user UI controls, they should begin with an uppercase character (it is "public" => use uppercase). If it is an internal variable or an internal variable that needs to be exposed as parameter, use the lowercase letter (like if it is "private"). Always **use camelCaseToSeparateWords** instead of using underlines_to_separate_words. If the identifier has an abbreviation, let only the first character of the abbreviation be uppercase, like WeHaveAbcAbbreviation or abcAbbreviation instead of weHaveABCAbbreviation or aBCAbbreviation.

Note: When using *global Parameters*, it can happen that the parameters will collide if they are named strictly in accordance with these naming conventions. Then, it is a good reason to break these conventions and call them differently. 

### Conditional Values and Custom Value Labels: Value Objects

Often, you need to limit some combinations of values, modify their labels or add thumbnails to them. To be able to achieve this, the plain list of values is not enough and we need something more complex, which are the *valueObjects*. A *Parameter* can have either *validValues* or *valueObjects*, not both (there will also be *validRange*, but we will get to it).

A *valueObject* has following structure:

~~~~
{
    "value":"132",
    "condition":"booleanExpression",
    "thumbnail":"url-to-an-image-in-PDC",
    "labels":{
        "en":"Custom label",
        "de":"Definierte Beschriftung"
    }
}
~~~~

* **value** The value that will be internally used. 
* **condition** A boolean expression that defines the visibility and possibility to select this  valueObject.
* **thumbnail** URL to a thumnbail image from the Roomle PDC.
* **labels** The custom labels data structure.

### Example: Parametrized Table Value Combinations

To best describe the usage of the *valueObjects*, let's say the table widths are called S, M and L and the table comes in two depth options: Standard and Extra, where the S width is not available in the Extra depth. To keep using the original numerical length values for the width and depth, we use *valueObjects* and we will modify the labels. For limiting the options, we use the condition. The parameters field of the table will look like this:

<details>
<summary>Unfold to see the final parameters code.</summary>
~~~~
"parameters": [
    {
        "key": "width",
        "type": "Decimal",
        "labels":{
            "en":"Width",
            "de":"Breite"
        },
        "unitType": "length",
        "defaultValue": 1000,
        "valueObjects":[
            {
                "value":800,
                "condition":"depth < 700",
                "labels":{
                    "en":"S",
                    "de":"klein"
                }
            },
            {
                "value":1000,
                "labels":{
                    "en":"M",
                    "de":"medium"
                }
            },
            {
                "value":1200,
                "labels":{
                    "en":"L",
                    "de":"groß"
                }
            }
        ],
        "enabled": true,
        "visible": true,
        "visibleInPartList": true
    },
    {
        "key": "depth",
        "type": "Decimal",
        "labels":{
            "en":"Depth",
            "de":"Tiefe"
        },
        "unitType": "length",
        "defaultValue": 600,
        "valueObjects":[
            {
                "value":600,
                "labels":{
                    "en":"Standard",
                    "de":"standard"
                }
            },
            {
                "value":700,
                "condition":"width > 800",
                "labels":{
                    "en":"Extra",
                    "de":"extra"
                }
            }
        ],
        "enabled": true,
        "visible": true,
        "visibleInPartList": true
    }
]
~~~~
</details>

**IMPORTANT:** In the last example, you can notice that the parameters' valueObjects conditions influence each other. If you are not careful, this can lead to a deadlock where you won't be able to select a certain combination to values and get back out of such combination. For example, size L is available only with Extra depth and the Extra depth is available only in size L. If such situation happens, you need to prioritize the parameters with the person that is responsible for the project.

### Ranges

Range allows you to make a slider UI control. You can specify the lower and upper bounds = of the range and optionally also a constant step size. An example of a range *Parameter* follows:

~~~~
{
    "key": "range",
    "defaultValue": 150,
    "type": "Decimal",
    "validRange": {
        "valueFrom": "100",
        "valueTo": "300",
        "step": "50"
    },
    "enabled": true,
    "visible": true,
    "visibleInPartList": true
}
~~~~

Note: As of June 2019, there is no possibility to combine a *range* with *valueObjects* or *validValues* to have these values on a slider. On the other hand, there is a possibility to have the bounds parametrized, but you must do it like in the following example so that the kernel parses the bounds as expressions and not as strings:

~~~~
{
    "key": "range",
    "defaultValue": 150,
    "type": "Decimal",
    "validRange": {
        "valueFrom": "0+lowerBound",
        "valueTo": "0+upperBound",
        "step": "0+stepSize"
    },
    "enabled": true,
    "visible": true,
    "visibleInPartList": true
}
~~~~

### Example: Parametrized Table Height

To improve our table's ergonomic properties, we will add a possibility of variable height. The table will be manufactured in four heights in 4 cm steps from 67 to 83 cm, except for the S width, which will be manufactured only in standard 71 cm height. We will have to disable the Height parameter for S size and also somehow ensure that a correct height will be used in the geometry.

~~~~
{
    "key": "height",
    "defaultValue": 710,
    "type": "Decimal",
    "validRange": {
        "valueFrom": "710 - 40 * (width != 800)",
        "valueTo": "710 + 120 * (width != 800)",
        "step": "40"
    },
    "enabled": "width != 800",
    "visible": "width != 800",
    "visibleInPartList": true
}
~~~~

We want to have the range parameter disabled and invisible when the Size is S. Also, we need to be sure that the geometry will have a height of 71 cm when the size is set to S. This can be achieved with a correct computation of the range's bounds. This will also reset the height to 71 cm if you select the S size and then a bigger size back. Alternatively, if such reset behaviour is not desired, you could make a helper variable in onUpdate like this:

~~~~
...
"validRange": {
    "valueFrom": "670",
    "valueTo": "830",
    "step": "40"
}
...
"onUpdate":"
    if (width == 800) {
        tableHeight = 710;
    } else {
        tableHeight = Height;
    }
"
~~~~

### Example: Procedural Shelf System with For Cycles

In this example, we are going to make a recantular shelf, which consists of thick outer wall and thin inner walls. It will basically be a grid of shelves with fields of size 35x35 cm with their horizontal and vertical counts determined by a parameter the end-user will be able to choose. In cases, where there are repeated segments that make a lot of combinations, it can be hard to maintain a huge number of models. A slightly more complex definition of the scripting project and problem decomposition can yield in the possibility to add more size options as easy as just to add a parameter option. Let's look step-by-step how such procedural component can be made using cycles. Let's have a look at the steps that will make the shelf:

1. We will have parameters with number of fields in the grid that make the shelf. For this, we define *Integer* Width and Height *parameters* with *validValues*, where the values are count of fields in X and Z dimensions. We could also limit the possible combinations of the shelf by using *valueObjects*. We also declare a parameter for the main shelf material, which we simply call *Material* according to the naming conventions.

~~~~
{
    "id": "demoCatalogId:Example_ProceduralShelf",
    "parameters": [
        {
            "key": "material",
            "enabled": "true",
            "visible": "true",
            "type": "Material",
            "defaultValue": "demoCatalogId:wood"
          },
          {
              "key":"width",
              "type":"Integer",
              "defaultValue":2,
              "validValues":[1,2,4,6],
              "enabled": true,
              "visible": true,
              "visibleInPartList": true
          },
          {
            "key":"height",
            "type":"Integer",
            "defaultValue":2,
            "validValues":[1,2,4,5,6],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ]
}
~~~~

2. In onUpdate function, we will declare the constants in an initialization block. We will need the dimensions of the shelf, wall thickness and sizes of the shelf grid's fields. The overall size of the shelf will be varying after user input, which means this needs to be recomputed after in every update call. The size consists of two outer wall thicknesses, number of fields times their size and number of inner walls times inner wall thickness. For now, we will be using these values only in the *geometry* script, but in future exmaples, we will use it also for specifying docking points. Because of that, we do all these helper calculations in onUpdate so that they are available everywhere. If we'd use them in the *geometry*, we couldn't use it for example for docking, because it is computed after the first *onUpdate* call and before the first *geometry* call. 

~~~~
"onUpdate":"
    if(ifnull(inited, false) == false) {
        inited = true;
        outerWallThickness = 50;
        innerWallThickness = 20;
        depth = 400;
        fieldSizeX = 350;
        fieldSizeZ = 350;
    }
    sizeX = 2 * outerWallThickness + width * fieldSizeX + (Width - 1) * innerWallThickness;
    sizeZ = 2 * outerWallThickness + height * fieldSizeZ + (Height - 1) * innerWallThickness;
"
~~~~

3. Now, we move to the *geometry* script, where we will be creating the outer frame and the inner ribs of the grid. We can draw the outer frame like this. Notice, that the primitives are made so that they do not collide in the corners: the left and right walls have the full height, but the top and botom walls are between them and have to be shorter.

~~~~
/* left and right wall */        
AddCube(Vector3f{outerWallThickness,depth,sizeZ}); 
SetObjSurface(material);
Copy();
MoveMatrixBy(Vector3f{sizeX - outerWallThickness,0,0}); // the cube pivot is in the bottom-left-rear corner

/* top and bottom walls */
AddCube(Vector3f{sizeX - 2*outerWallThickness,depth,outerWallThickness}); // top and bottom walls are between the 
SetObjSurface(material);
MoveMatrixBy(Vector3f{outerWallThickness,0,0}); // moves to the right end of the left wall
Copy();
MoveMatrixBy(Vector3f{0,0,sizeZ - outerWallThickness}); 
~~~~

4. The count of internal floors of the shelves (horizontal dividers) is number of fields in Z direction minus one. If the count of fields in vertical direction is not 1, we draw the cube making the shelf floor and move it to the position of the first shelf. If there are more than two fields, we copy it and move by one up. Notice that we initialize the *i* value in the *for* cycle to 2. If Height == 2, it will not enter the loop (condition will be 2 < 2) at all, we do not need to check if height > 2. 

~~~~
if (height > 1) {
    AddCube(Vector3f{sizeX - 2 * outerWallThickness,depth,innerWallThickness});
    SetObjSurface(material);
    MoveMatrixBy(Vector3f{outerWallThickness,0,outerWallThickness + fieldSizeZ});
    for (i = 2; i < height; i++) {
        Copy();
        MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
    }
}
~~~~

5. The count of internal vertical dividers is Width - 1. We will use the same logic as with the horizontal dividers to generate them. The difference is, that we need to generate them for all levels separately, so that they do not get drawn over each other, which would create coplanarities in their intersections. Also, the AddCube function draws a cube which edges are slightly rounded. That is why we draw the vertical dividers in one level, enclose them in a group and then we copy the whole group of these dividers and move them always one level up.

~~~~
if (width > 1) {
    BeginObjGroup('VERTICAL_DIVIDERS');
        AddCube(Vector3f{innerWallThickness,depth,fieldSizeZ});    
        SetObjSurface(material);
        MoveMatrixBy(Vector3f{outerWallThickness + fieldSizeX,0,outerWallThickness});
        for (i = 2; i < width; i++) {
            Copy();
            MoveMatrixBy(Vector3f{innerWallThickness + fieldSizeX, 0, 0});
        }
    EndObjGroup();
    for (i = 1; i < height; i++) {
        Copy();
        MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
    }    
}
~~~~

The result should look like this:

![alt text](images/part1_proceduralShelf.png)

<details>
<summary>Unfold to see the final source code</summary>

~~~~
{
    "id": "demoCatalogId:Example_ProceduralShelf",
    "parameters": [
        {
            "key": "material",
            "enabled": "true",
            "visible": "true",
            "type": "Material",
            "defaultValue": "demoCatalogId:wood"
          },
          {
              "key":"width",
              "type":"Integer",
              "defaultValue":2,
              "validValues":[1,2,4,6],
              "enabled": true,
              "visible": true,
              "visibleInPartList": true
          },
          {
            "key":"height",
            "type":"Integer",
            "defaultValue":2,
            "validValues":[1,2,4,5,6],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ],
    "onUpdate":"
        if(ifnull(inited, false) == false) {
            inited = true;
            outerWallThickness = 50;
            innerWallThickness = 20;
            depth = 400;
            fieldSizeX = 350;
            fieldSizeZ = 350;
        }
        sizeX = 2 * outerWallThickness + width * fieldSizeX + (width - 1) * innerWallThickness;
        sizeZ = 2 * outerWallThickness + height * fieldSizeZ + (height - 1) * innerWallThickness;
    ",
    "geometry": " 
        /* left and right wall */        
        AddCube(Vector3f{outerWallThickness,depth,sizeZ}); 
        SetObjSurface(Material);
        Copy();
        MoveMatrixBy(Vector3f{sizeX - outerWallThickness,0,0});

        /* top and bottom walls */
        AddCube(Vector3f{sizeX - 2*outerWallThickness,depth,outerWallThickness});
        SetObjSurface(Material);
        MoveMatrixBy(Vector3f{outerWallThickness,0,0});
        Copy();
        MoveMatrixBy(Vector3f{0,0,sizeZ - outerWallThickness});

        /* horizontal dividers */
        if (height > 1) {
            AddCube(Vector3f{sizeX - 2 * outerWallThickness,depth,innerWallThickness});
            SetObjSurface(material);
            MoveMatrixBy(Vector3f{outerWallThickness,0,outerWallThickness + fieldSizeZ});
            for (i = 2; i < height; i++) {
                Copy();
                MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
            }
        }

        /* vertical dividers */
        if (width > 1) {
            BeginObjGroup('VERTICAL');
                AddCube(Vector3f{innerWallThickness,depth,fieldSizeZ});    
                SetObjSurface(material);
                MoveMatrixBy(Vector3f{outerWallThickness + fieldSizeX,0,outerWallThickness});
                for (i = 2; i < width; i++) {
                    Copy();
                    MoveMatrixBy(Vector3f{innerWallThickness + fieldSizeX, 0, 0});
                }
            EndObjGroup();
            for (i = 1; i < height; i++) {
                Copy();
                MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
            }            
        }
   "
}
~~~~
</details>

## Docking

Docking is a way of connecting multiple components together. If the user is to dock something, he will click the addon button, pick an item from the list of possible children and place it where the configurator displays the Docking Previews. There is always one parent and multiple children can be docked to it. Every component can act as a child, as a parent or as none or both of these. This will form a parent-child tree hierarchy. The starting component in this hierarchy is the *root component* and is the only one that is not and can not be a child.

To define the alignment between parent and child components, we define Docking Points, ranges or lines at the parent's side and Docking Points on the child's side. The Docking Point is always one point of the Docking, a Docking range is a range of *Docking Points* in X, Y and Z directions and a Docking line is a continuous line between two points. Every Docking Point defines the position and rotation to allow corner docking. 

You can also define *Sibling Points* that can be used to communicate independently of the parent-child tree hierarchy. We will talk about them later in more advanced chapters.

### Docking Points

A *Docking Point* not only provides the position and rotation between two components, but also it provides a communication channel to share parameters' and variables' values. That means that a change in one component can influence another component. For example, if you need several components with the same height, you can distribute the height within the docked components. Such communication is achieved via *Assignments*, that can happen as *onDock*, *onUpdate* and *onUnDock* events. A *Docking* can be achieved between any two Docking Points, that have matching mask and condition is true on both sides.

See the following example of the pair of child and parent *Docking Points* in a *Component*. Note that you do not have to have them in a single component - any component can be docked to any component as long as the masks match and conditions are true on both sides.

~~~~
"parentDockings": {
    "points": [
        {
            "mask": "dockingMask",
            "position": "{width/2,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        }
    ]
},
"childDockings": {
    "points": [
        {
            "mask": "dockingMask",
            "position": "{-width/2,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        }
    ]
}
~~~~

Notice that the parent has the docking point at x = width/2, which is at the right side. The child dock point has x = - width/2, which is on the left side. If you put both points at the same positions, the *Components* would be coincident (if the rotation is also the same).

**IMPORTANT:** It is a good practice to call the docking mask so that it is clear where the docking point is located. A good naming convention is **projectnameDirection**, like sleeperSofaLeft. Always **call the docking point mask from the perspective of the parent**. That means, the point with sleeperSofaLeft mask will be on the left in the parent, but on the right side in the child. This also applies for helper docking variables. For **accessories and attachments** that can be docked in multiple places (like handle, pillow), call the mask **projectnameAccessorytype**. For standard parts or project independent parts, do not use the projectname prefix.

### Possible Children

In the *Possible Children* list you specify which *Components* can dock to this *Component*. If more different *Components* are docked together, in the Add-Ons the union of all *possibleChildern* list is shown. The *Possible Children* are not evaluated if their dockings match, you must do such filtering by yourself using the possible children' conditions. If there is at least one *possibleChild* with true condition, the Add-On button is shown in the configurator.

~~~~
"possibleChildren": [
    {
        "componentId": "demoCatalogId:Example_ProceduralShelf",
        "condition":"true"
    },
    {
        "itemId": "demoCatalogId:Example_ProceduralShelf",
        "condition":"true"
    }
]
~~~~

### Example: One-Way Docking

### Example: Docking Shelves in an Inline Two-Way Docking

In this example, we take the Procedural Shelf we made in one of previous examples and implement docking so that we can dock multiple instances of such shelves together, forming a shelf set.

1. We will add the docking points and possible children to the set. We must know the positions of the connection points. Because the shelf's pivot is in the bottom-rear-left corner and we know the length in the X direction in the sizeX variable. From this, we can write the docking points as:

~~~~
"parentDockings": {
    "points": [
        {
            "mask": "shelfLeft",
            "position": "{0,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        },
        {
            "mask": "shelfRight",
            "position": "{sizeX,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        }
    ]
},
"childDockings": {
    "points": [
        {
            "mask": "shelfLeft",
            "position": "{sizeX,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        },
        {
            "mask": "shelfRight",
            "position": "{0,0,0}",
            "rotation": "{0,0,0}",
            "condition": "true"
        }
    ]
}
~~~~

2. We add possible child:

~~~~
"possibleChildren": [
    {
        "componentId": "demoCatalogId:Example_ProceduralShelf",
        "condition":"true"
    }
]
~~~~

3. After uploading it to the database and testing this, we can see that we have previous (and they work) even in places no shelf fits:

![alt text](images/part1_prodecuralShelfDocking.png)

This is because that although the docking point pairs get occupied, there is still remains the other direction matching pair that is unocuppied and thus available for the docking. To deactivate this, we will add helper variables that store the docking status. We add a dockedSide variable into onUpdate-inited block:

~~~~
if(ifnull(inited, false) == false) {
    inited = true;
    ...
    dockedSide = 0;                    
}
~~~~

As per variable naming convention, it starts with a lowercase letter and stores information about where it is docked: 0 will be nowhere (=root component), -1 on left and +1 on right. Then, we can disable the right docking point if the component is docked as a left child and vice versa. To determine, whether the component is docked on the left or right side, docking assignments will be used: either assignments from the parent or self assignments in the child. In this case, it does not matter which of the assignments we use. Please, keep the rule that if you assign something in onDock, make also an inverse assignment in onUnDock, because the end-user can drag the components around and re-dock them.

~~~~
"parentDockings": {
    "points": [
        {
            "mask": "shelfLeft",
            "position": "{0,0,0}",
            "rotation": "{0,0,0}",
            "condition": "dockedSide < 1",
            "assignmentsOnDock": {
                "dockedSide":"-1"
            },
            "assignmentsOnUnDock": {
                "dockedSide":"0"
            }
        },
        {
            "mask": "shelfRight",
            "position": "{sizeX,0,0}",
            "rotation": "{0,0,0}",
            "condition": "dockedSide > -1",
            "assignmentsOnDock": {
                "dockedSide":"1"
            },
            "assignmentsOnUnDock": {
                "dockedSide":"0"
            }
        }
    ]
}
~~~~

<details>
<summary>Unfold to see the final source code</summary>

~~~~
{
    "id": "demoCatalogId:Example_ProceduralShelf",
    "parameters": [
        {
            "key": "material",
            "enabled": "true",
            "visible": "true",
            "type": "Material",
            "defaultValue": "demoCatalogId:wood"
        },
        {
            "key": "width",
            "type": "Integer",
            "defaultValue": 2,
            "validValues": [
                1,
                2,
                4,
                6
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        },
        {
            "key": "height",
            "type": "Integer",
            "defaultValue": 2,
            "validValues": [
                1,
                2,
                4,
                5,
                6
            ],
            "enabled": true,
            "visible": true,
            "visibleInPartList": true
        }
    ],
    "onUpdate": "
            if(ifnull(inited, false) == false) {
                inited = true;
                outerWallThickness = 50;
                innerWallThickness = 20;
                depth = 400;
                fieldSizeX = 350;
                fieldSizeZ = 350;
                dockedSide = 0;                    
            }
            sizeX = 2 * outerWallThickness + width * fieldSizeX + (Width - 1) * innerWallThickness;
            sizeZ = 2 * outerWallThickness + height * fieldSizeZ + (Height - 1) * innerWallThickness;
    ",
    "geometry": "     
            /* left and right wall */        
            AddCube(Vector3f{outerWallThickness,depth,sizeZ}); 
            SetObjSurface(material);
            Copy();
            MoveMatrixBy(Vector3f{sizeX - outerWallThickness,0,0});
    
            /* top and bottom walls */
            AddCube(Vector3f{sizeX - 2*outerWallThickness,depth,outerWallThickness});
            SetObjSurface(material);
            MoveMatrixBy(Vector3f{outerWallThickness,0,0});
            Copy();
            MoveMatrixBy(Vector3f{0,0,sizeZ - outerWallThickness});
    
            /* horizontal dividers */
            if (height > 1) {
                    AddCube(Vector3f{sizeX - 2 * outerWallThickness,depth,innerWallThickness});
                SetObjSurface(Material);
                MoveMatrixBy(Vector3f{outerWallThickness,0,outerWallThickness + fieldSizeZ});
                for (i = 2; i < height; i++) {
                        Copy();
                        MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
                }
            }
    
            /* vertical dividers */
            if (width > 1) {
                    BeginObjGroup('VERTICAL');
                        AddCube(Vector3f{innerWallThickness,depth,fieldSizeZ});    
                    SetObjSurface(material);
                    MoveMatrixBy(Vector3f{outerWallThickness + fieldSizeX,0,outerWallThickness});
                    for (i = 2; i < width; i++) {
                            Copy();
                            MoveMatrixBy(Vector3f{innerWallThickness + fieldSizeX, 0, 0});
                    }
                EndObjGroup();
                for (i = 1; i < height; i++) {
                        Copy();
                        MoveMatrixBy(Vector3f{0,0,innerWallThickness + fieldSizeZ});
                }            
            }
    ",
    "parentDockings": {
        "points": [
            {
                "mask": "shelfLeft",
                "position": "{0,0,0}",
                "rotation": "{0,0,0}",
                "condition": "dockedSide < 1",
                "assignmentsOnDock": {
                    "dockedSide":"-1"
                },
                "assignmentsOnUnDock": {
                    "dockedSide":"0"
                }
            },
            {
                "mask": "shelfRight",
                "position": "{sizeX,0,0}",
                "rotation": "{0,0,0}",
                "condition": "dockedSide > -1",
                "assignmentsOnDock": {
                    "dockedSide":"1"
                },
                "assignmentsOnUnDock": {
                    "dockedSide":"0"
                }
            }
        ]
    },
    "childDockings": {
        "points": [
            {
                "mask": "shelfLeft",
                "position": "{sizeX,0,0}",
                "rotation": "{0,0,0}",
                "condition": "true"
            },
            {
                "mask": "shelfRight",
                "position": "{0,0,0}",
                "rotation": "{0,0,0}",
                "condition": "true"
            }
        ]
    },
    "possibleChildren": [
        {
            "componentId": "demoCatalogId:Example_ProceduralShelf",
            "condition":"true"
        }
    ]
}
~~~~
</details>

### Global Parameters

There are cases where you need to have a parameter that is distributed across all components. For example, whether a set of connected cupboards has legs or the main surface material of a component sofa system. You can set a parameter to be global by setting it's attributes *global* and *visibleAsGlobal* to true. Normally, if you have nothing selected, you get UI controls for the parameters of the root component. If there is a global parameter in any of the components in the configuration and you do not have anything selected, the parameters in the global context are shown. The global parameters work in the same way as local parameters, but if they are interacted in the global context, it will be assigned in all components that have a global parameter of the same key. Still, if the parameter has *visible* and *enabled* set to true, you can change the parameter for the one component. This way, you can set the color of all components in the configuration at once, but you can still have one that has a different color.

The principle of global parameter is that on clicking the value, it will get distributed to the components that have a global parameter with a matching key. Consider it like an UI. Unfortunately, it is an one-way process only: changing any local parameter or internal variable will not have any influence on global parameters (note: as of August 2019, there is a possibility to be changed in the future)

### Example: Global Material Parameter for Shelf System

We will now try out what was written in the previous chapter. Let's add one more option to the Material parameter and make it global:

~~~~
{
    "key": "material",
    "enabled": "true",
    "global":"true",
    "visibleAsGlobal":"true",
    "visible": "true",
    "type": "Material",
    "defaultValue": "demoCatalogId:wood",
    "validValues":[
        "demoCatalogId:wood",
        "demoCatalogId:defaultGray"
    ]
}
~~~~~

Now, you can dock the shelves together and from the global context, you can set the color for all of them at once and then select a particular shelf and change only color of the currently selected instance. If you want to force the configuration to have all of them in the same color, you just set visible to false.

[Glimmer]: https://alpha.roomle.com/t/configurator-testing/