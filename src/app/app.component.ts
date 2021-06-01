import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Customer} from './customer';
import {CustomerService} from './customerservice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as cloneDeep from 'lodash/cloneDeep';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    customers: Customer[];

    rowGroupMetadata: any;

    exportColumns;

    cols: any[];

    constructor(private customerService: CustomerService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.customerService.getCustomersMedium().then(data => {
            this.customers = data;
            this.updateRowGroupMetaData();
            this.cdr.detectChanges();
        });
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'country', header: 'Country' },
            { field: 'company', header: 'Company' },
            { field: 'status', header: 'Status' },
            { field: 'representative', header: 'Representative' },
            { field: 'date', header: 'Date' }
        ];
        this.exportColumns = this.cols.map(col => ({
            title: col.header,
            dataKey: col.field
        }));
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    exportPdf() {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('With content', 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        const  customers = cloneDeep(this.customers);
        customers.forEach(x => {
            x.country = x.country.name;
            x.representative = x.representative.name;
        });
        doc['autoTable'](this.exportColumns, customers);
        doc.save('table' + new Date().getTime() + '.pdf');
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers) {
            for (let i = 0; i < this.customers.length; i++) {
                const rowData = this.customers[i];
                const representativeName = rowData.representative.name;

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.customers[i - 1];
                    const previousRowGroup = previousRowData.representative.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }
}
