import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from './customer';
import { CustomerService } from './customerservice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent { 
     customers: Customer[];

    rowGroupMetadata: any;

    constructor(private customerService: CustomerService) { }

    ngOnInit() {
        this.customerService.getCustomersMedium().then(data => {
            this.customers = data;
            this.updateRowGroupMetaData();
        });
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

      exportPdf() {
    // const doc = new jsPDF();
    const doc = new jsPDF('p','pt');
    doc['autoTable'](this.exportColumns, this.products);
    // doc.autoTable(this.exportColumns, this.products);
    doc.save("products.pdf");
  }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers) {
            for (let i = 0; i < this.customers.length; i++) {
                let rowData = this.customers[i];
                let representativeName = rowData.representative.name;
                
                if (i == 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    let previousRowData = this.customers[i - 1];
                    let previousRowGroup = previousRowData.representative.name;
                    if (representativeName === previousRowGroup)
                        this.rowGroupMetadata[representativeName].size++;
                    else
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                }
            }
        }
    }
}
