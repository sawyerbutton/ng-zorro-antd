/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { DragDrop } from '@angular/cdk/drag-drop';
import { OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { nzModalAnimations } from './modal-animations';
import { BaseModalContainer } from './modal-container';
import { NzModalTitleComponent } from './modal-title.component';
import { ModalOptions } from './modal-types';

@Component({
  selector: 'nz-modal-container',
  exportAs: 'nzModalContainer',
  template: `
    <div
      #modalElement
      role="document"
      class="ant-modal"
      [ngClass]="config.nzClassName!"
      [ngStyle]="config.nzStyle!"
      [style.width]="config?.nzWidth! | nzToCssUnit"
    >
      <div class="ant-modal-content">
        <button *ngIf="config.nzClosable" nz-modal-close (click)="onCloseClick()"></button>
        <div *ngIf="config.nzTitle" nz-modal-title></div>
        <div class="ant-modal-body" [ngStyle]="config.nzBodyStyle!">
          <ng-template cdkPortalOutlet></ng-template>
          <div *ngIf="isStringContent" [innerHTML]="config.nzContent"></div>
        </div>
        <div
          *ngIf="config.nzFooter !== null"
          nz-modal-footer
          [modalRef]="modalRef"
          (cancelTriggered)="onCloseClick()"
          (okTriggered)="onOkClick()"
        ></div>
      </div>
    </div>
  `,
  animations: [nzModalAnimations.modalContainer],
  // Using OnPush for modal caused footer can not to detect changes. we can fix it when 8.x.
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    tabindex: '-1',
    role: 'dialog',
    '[class]': 'config.nzWrapClassName ? "ant-modal-wrap " + config.nzWrapClassName : "ant-modal-wrap"',
    '[style.zIndex]': 'config.nzZIndex',
    '[@.disabled]': 'config.nzNoAnimation',
    '[@modalContainer]': 'state',
    '(@modalContainer.start)': 'onAnimationStart($event)',
    '(@modalContainer.done)': 'onAnimationDone($event)',
    '(mousedown)': 'onMousedown($event)',
    '(mouseup)': 'onMouseup($event)'
  }
})
export class NzModalContainerComponent extends BaseModalContainer {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: CdkPortalOutlet;
  @ViewChild(NzModalTitleComponent, { static: false }) modalHeaderRef!: NzModalTitleComponent;
  @ViewChild('modalElement', { static: true }) modalElementRef!: ElementRef<HTMLDivElement>;
  constructor(
    elementRef: ElementRef,
    focusTrapFactory: ConfigurableFocusTrapFactory,
    cdr: ChangeDetectorRef,
    render: Renderer2,
    zone: NgZone,
    overlayRef: OverlayRef,
    nzConfigService: NzConfigService,
    dragDrop: DragDrop,
    public config: ModalOptions,
    @Optional() @Inject(DOCUMENT) document: NzSafeAny,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationType: string
  ) {
    super(elementRef, focusTrapFactory, cdr, render, zone, overlayRef, nzConfigService, dragDrop, config, document, animationType);
  }
}
