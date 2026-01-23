"use client";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs as any;

interface PDFData {
  type: "inscription" | "minerval";
  id: string;
  titre: string;
  description: string;
  tranche: any;
  etablissement: string;
  annee: string;
  qrCodeUrl: string;
}

class PDFGenerator {
  static generatePaymentSlip(data: PDFData) {

    const docDefinition = {
      content: [
        {
          text: data.titre,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        {
          columns: [
            {
              width: '60%',
              stack: [
                {
                  text: 'INFORMATIONS DE PAIEMENT',
                  style: 'subheader',
                  margin: [0, 0, 0, 10]
                },
                {
                  table: {
                    widths: ['30%', '70%'],
                    body: [
                      ['Établissement:', data.etablissement],
                      ['Année académique:', data.annee],
                      ['Type:', data.type === 'inscription' ? 'Inscription' : 'Minerval'],
                      ['Tranche:', data.tranche.designation],
                      ['Montant:', `${data.tranche.montant.toLocaleString()} USD`],
                      ['Description:', data.description],
                      ['Référence:', data.id.slice(-8)]
                    ]
                  },
                  layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#e5e7eb',
                    vLineColor: () => '#e5e7eb'
                  }
                }
              ]
            },
            {
              width: '5%',
              text: ''
            },
            {
              width: '35%',
              stack: [
                {
                  text: 'SCANNER POUR PAYER',
                  style: 'qrTitle',
                  alignment: 'center',
                  margin: [0, 0, 0, 10]
                },
                {
                  qr: `${typeof window !== 'undefined' ? window.location.origin : ''}${data.qrCodeUrl}`,
                  fit: 120,
                  alignment: 'center',
                  margin: [0, 0, 0, 10]
                },
                {
                  text: 'Scannez ce QR code avec votre smartphone pour procéder au paiement en ligne',
                  style: 'qrInstructions',
                  alignment: 'center'
                }
              ]
            }
          ]
        },
        {
          text: '\n\nINSTRUCTIONS:',
          style: 'instructionsHeader',
          margin: [0, 20, 0, 5]
        },
        {
          ul: [
            'Présentez cette fiche lors du paiement',
            'Conservez votre reçu de paiement',
            'En cas de problème, contactez le service financier',
            'Le paiement peut également être effectué via le QR code ci-dessus'
          ],
          margin: [0, 0, 0, 20]
        },
        {
          text: `Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
          style: 'footer',
          alignment: 'center',
          margin: [0, 30, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#1f2937'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#374151'
        },
        qrTitle: {
          fontSize: 12,
          bold: true,
          color: '#6366f1'
        },
        qrInstructions: {
          fontSize: 8,
          color: '#6b7280',
          italics: true
        },
        instructionsHeader: {
          fontSize: 12,
          bold: true,
          color: '#374151'
        },
        footer: {
          fontSize: 8,
          color: '#9ca3af',
          italics: true
        }
      },
      pageMargins: [40, 40, 40, 40]
    };

    pdfMake.createPdf(docDefinition).download(`${data.type}_${data.id.slice(-8)}.pdf`);
  }
}

export default PDFGenerator;