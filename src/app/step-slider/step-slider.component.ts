import { Component, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, timer } from "rxjs";
import { takeWhile } from "rxjs/operators";

@Component({
  selector: 'step-slider',
  templateUrl: './step-slider.component.html',
  styleUrls: ['./step-slider.component.scss']
})
export class StepSliderComponent implements AfterViewInit {

  currentStep: number = 0;
  numbers: number[];

  scrollAmount: number;

  shouldAnimate : boolean = false;
  scrollTimer : Subscription; 

  itemWidth: number = 0; 
  componentWidth: number = 0;

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChildren('item') steps: QueryList<ElementRef>;


  @Input('step-number') stepNumber: number;
  @Output('select-step') selectStep: EventEmitter<number> = new EventEmitter();

  ngAfterViewInit() {
    this.calculateValues() 
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


  centerStep( i: number ) {
    

    let target = this.steps.toArray()[i].nativeElement
    let wrapper = this.wrapper.nativeElement;

    
    if( i != this.currentStep ) {
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

          this.currentStep = i;

          this.selectStep.emit( i )

        }

      });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.calculateValues()
    this.centerStep( this.currentStep );
  }


  
}
