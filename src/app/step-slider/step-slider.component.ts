import { Component, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, timer } from "rxjs";
import { takeWhile } from "rxjs/operators";

@Component({
  selector: 'step-slider',
  templateUrl: './step-slider.component.html',
  styleUrls: ['./step-slider.component.scss']
})
export class StepSliderComponent implements AfterViewInit {

  numbers: number[];

  scrollAmount: number;

  shouldAnimate : boolean = false;
  scrollTimer : Subscription; 

  itemWidth: number = 0; 
  componentWidth: number = 0;

  nextActiveStep: number = null;
  activeStep : number = 0;
  initialized : boolean = false;
  
  
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChildren('item') steps: QueryList<ElementRef>;
  
  
  @Input('step-number') stepNumber: number;
  @Output('select-step') selectStep: EventEmitter<number> = new EventEmitter();
  
  // @Input('current-step') activeStep: number = 0;
  
  @Input('current-step')
  set currentStep( i : number ) {
    
    i = i == undefined ? 0 : i;
    
    this.nextActiveStep = i;

    if( this.initialized ) {      
      this.activateStep( i );
    }

  }

  ngOnChanges() {
    this.calculateValues()
  }


  ngAfterViewInit() {
    this.initialized = true;
    this.calculateValues(); 
    this.activateStep( this.nextActiveStep );
  } 
  
  calculateValues() {
    this.componentWidth = this.wrapper.nativeElement.offsetWidth;
    this.itemWidth = this.steps.toArray()[0].nativeElement.offsetWidth;
  }
  
  constructor() { }

  ngOnInit() {
    
    this.numbers = Array(this.stepNumber).fill('').map((x,i)=>i);
    this.itemWidth = 0;
    this.componentWidth = 0;

  }


  activateStep( i: number ) {
        
    this.nextActiveStep = i;

    let target = this.steps.toArray()[i].nativeElement
    let wrapper = this.wrapper.nativeElement;

    
    if( i != this.activeStep ) {
      this.shouldAnimate = true;    
    }

    if( !! this.scrollTimer ) {
      this.scrollTimer.unsubscribe()
    }

    this.scrollTimer = timer(30,30).pipe(

        takeWhile(() => this.shouldAnimate )).subscribe((e) => {
          
          let targetLeft;

          targetLeft = Math.max( target.offsetLeft - this.componentWidth / 2 + this.itemWidth / 2, 0 );
          targetLeft = Math.min( targetLeft, wrapper.scrollWidth - wrapper.offsetWidth );

          if (wrapper.scrollLeft > targetLeft ) {

            this.scrollAmount = wrapper.scrollLeft - 10;


          } else if (wrapper.scrollLeft < targetLeft) {

            this.scrollAmount = wrapper.scrollLeft + 10;


          }
                  
        if (
          
          wrapper.scrollLeft == targetLeft
          ||
          wrapper.scrollLeft + 10 > targetLeft && wrapper.scrollLeft - 10 < targetLeft
       
        ) {

          this.shouldAnimate = false;

          this.activeStep = i;

          this.selectStep.emit( i )

        }

      });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculateValues()
    this.activateStep( this.activeStep );
  }


  
}
