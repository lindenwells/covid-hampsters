# covid-hampsters
This is the repo for "Team DROP_TABLE Students" in the subject DECO3801 in semester 2 2021 at UQ. 
Covid-hampsters is just a random name we chose for our repository. 

# Running

If you want to run the app, run `npm install`, then `npm start` (if you have npm installed). 
Or, you can view the deployed app at: https://hospital-bed-tracker.web.app/

# Main Files

This is where the majority of the interesting app behaviour happens. 

## App.tsx
Main file for routing to different pages (home, about etc.). 

## Map.tsx
This controls the main map on the home page, and handles creating the polygons for each area. 

## Table.tsx & DataGrid.tsx
When you select a hospital from the main map, you get to a table, which displays all hospitals in that area. Both of these files relate to that. 

## Chart.tsx
Displays the chart for each individual hospital, and the overall chart for each area, depending on the buttons clicked. 

## Login.tsx
Handles the login button

# firebase.ts
Handles Firebase authentication
