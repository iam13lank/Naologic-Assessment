# Naologic Assessment – Work Order Timeline Application

A fully interactive Angular application that visualizes work orders across multiple timescales (Day, Week, Month) using a custom-built timeline/Gantt‑style UI. Users can create, edit, and delete work orders, and all changes persist automatically using browser localStorage.

---

## Features

- Interactive timeline with Day, Week, and Month views  
- Slide‑in panel for creating and editing work orders  
- Custom datepicker integration using `@ng-bootstrap/ng-bootstrap`  
- Styled dropdowns using `@ng-select/ng-select`  
- Non-overlapping work order rendering per work center  
- LocalStorage persistence (work orders survive page refreshes)  
- Standalone Angular components (Angular 17+ style)  
- Reactive Forms with custom validators (date range + overlap detection)  
- Responsive layout with sticky headers and scrollable timeline  

---

## Tech Stack

- **Angular 21.2.0**  
- **TypeScript 5.9**  
- **RxJS 7.8**  
- **ng-bootstrap 20** (datepicker)  
- **ng-select 21.5** (dropdowns)  
- **Vitest** for unit testing  
- **LocalStorage** for persistence  
- **SCSS** for styling  

---

## Required Angular Modules

The application uses the following Angular modules:

- `CommonModule`  
- `ReactiveFormsModule`  
- `NgbDatepickerModule`  
- `NgSelectModule`  
- `RouterModule` (if routing is enabled)  

Each standalone component imports only what it needs.


## Development Server

Start the development server:

```bash
ng serve
```

Then open:

http://localhost:4200/



## Dependencies
  Runtime Dependencies
    @angular/common

    @angular/core

    @angular/forms

    @angular/router

    @ng-bootstrap/ng-bootstrap

    @ng-select/ng-select

    rxjs

    tslib

## Dev Dependencies
    @angular/cli

    @angular/build

    @angular/compiler-cli

    typescript

    vitest

    jsdom

    prettier