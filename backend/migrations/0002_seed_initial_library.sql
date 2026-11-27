-- Imported reference library from BlueLight Cases-combined.pdf. Generated from the approved frontend seed data.
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('backorders','Backorders & ETA','Backorder, factory delay, ETA and supplier chase scenarios',1);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('delivery','Order status & delivery','Order progress, packing and delivery status guidance',2);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('parts','Parts & supersessions','Part identification, suppliers, exchange and supersession guidance',3);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('mobility','Mobility & special vehicles','One Mobility, Car Down and special vehicle processes',4);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('calls','Calls & case logging','Calls, Salesforce, Quick Logs and case feedback',5);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('systems','Systems & portals','UK SAP, German SAP, Spanish SAP, PARDS, VMS and portals',6);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('stock','Stock & availability','Factory stock, availability and incoming stock allocation',7);
INSERT OR IGNORE INTO categories (id,name,description,sort_order) VALUES ('exceptions','Exceptions & escalations','Cancelled orders, delivery blocks and unusual order outcomes',8);
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-001','bluelight-cases-pekb-001','BlueLight Cases','Identifies BlueLight and VIP requests and explains the priority and ETA-chase steps, including the OTLG email template.','## Identifying
- When there is an email to expedite / chase an ETA sent by the BlueLight team, not a partner.
- Or the retailer left a note that this order is for a VIP person like a celebrity, the Royal Family, police shop, ambulance...etc.

## Process
- Expedite to a 2, always.
- Send an ETA chase to PARDS via OTLG Backorders email and let them know it is a BlueLight ETA request and that this part needs to be expedited to a 0.

## Template example
Template to send to UK-Backorder@volkswagen-otlg.de:

Hello Team,
Please provide an ETA for this part:
- Order number:
- Part number:
- VIN:
Kindly note that this request is for a BlueLight vehicle, and it needs to be expedited to priority 0.
Thank you in advance!
Kind regards','backorders','published','BlueLight Cases-combined.pdf','1–2',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-bluelight','BlueLight','bluelight');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-bluelight');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vip-request','VIP request','vip-request');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-vip-request');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-priority-2','Priority 2','priority-2');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-priority-2');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-priority-0','Priority 0','priority-0');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-priority-0');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-pards','PARDS','pards');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-pards');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-otlg','OTLG','otlg');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-otlg');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-eta-chase','ETA chase','eta-chase');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-001','tag-eta-chase');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-002','bottleneck-pekb-002','Bottleneck','How to recognise a Bottleneck Management / Fair Share block, prioritise the order and handle an ETA update or chase.','## Identifying
If the order is on Bottleneck management / Fair Share block. Which can be recognized by checking factory stock and backorders, or from PARDS comments

## Process
- Expedite the part to (3) if there is no car hire and to (2) if there is a car hire.
- If there is an ETA mentioned on SAP, or on PARDS comment section as a recent update, inform the retailer of this date.
- If there is no current ETA, send an ETA Chase to PARDS, and advise the retailer that there is no ETA for the part, and that we sent an ETA chase request, and let the retailer know that they need to check pards for eta updates

Template Ex: Hello XXXX, Upon checking your order, the part is on factory back order. I have prioritized the order and sent an ETA chase request to PARDS.

I recommned keeping an eye on PARDS for ETA updates. If you have any further questions, don’t hesitate to contact us. Hope you have a great day.

Kind regards','backorders','published','BlueLight Cases-combined.pdf','3–4',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-bottleneck','Bottleneck','bottleneck');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-bottleneck');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-fair-share','Fair Share','fair-share');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-fair-share');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-factory-backorder','Factory backorder','factory-backorder');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-factory-backorder');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-car-hire','Car hire','car-hire');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-car-hire');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-priority-2');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-priority-3','Priority 3','priority-3');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-priority-3');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-002','tag-pards');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-003','calls-scenarios-pekb-003','Calls Scenarios','Call-handling scenarios for expediting and PARDS ETA chases, including the information needed and OTLG contact routes.','## Expediting
We can only expedite through calls if the caller has already submitted an E-form. If they have not, we can still expedite if they have the information needed to create a normal E-form Quick Log:
1. RDC Number
2. Order number
3. Part number
4. VIN
- After expediting, coach the caller to inform the RDC that an E-form must also be submitted, because it is mandatory to keep all departments aligned.
- If the caller does not have all the information, do not expedite.

## ETA Chase on PARDS
If a call is received for an order that has no ETA and an ETA chase is needed:
### If the caller is the RDC
- RDC number
- RDC agent name
- RDC e-mail
- VIN / Registration

### If the caller is from AA or CSC
- Vehicle Registration / VIN
The PARDS ETA chase request can be completed using your name in the name section. In the email section, add the expediting mailbox. Advise the contact to reach out again, or call them, to provide the ETA update.

## If the order is not available on PARDS
- Genuine parts: UK-Backorder@volkswagen-otlg.de
- Accessories: OTLGCDIUK.VWZandTools@volkswagen-otlg.de
- Parts sourced from TPS or a third party: disposition.kassel@volkswagen-otlg.de','calls','published','BlueLight Cases-combined.pdf','5–6',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-phone-call','Phone call','phone-call');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-phone-call');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-expediting','Expediting','expediting');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-expediting');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-e-form','E-form','e-form');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-e-form');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-quick-log','Quick log','quick-log');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-quick-log');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-rdc','RDC','rdc');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-rdc');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-pards');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-003','tag-eta-chase');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-004','cancelled-order-pekb-004','Cancelled order','How to inspect a rejection reason in UK SAP, avoid expediting a cancelled order and ask the retailer to reorder.','## Identifying

## Rejections

- In case of a rejected part, sometimes the rejection reason is not fully clarified in the ''Reasons for Rejactions'' tab, so in this case, we double-click on the part number in the Change Sales Orders tab in UK SAP to view the page below:

- Click on ''Texts''

Click on each of the tabs on the side to view all the factory notes on this part, including the rejection reason.

## Process
- Do not expedite the part.

- Inform the Retailer to order the part again and resubmit the form with the new order details.

Template Ex: Hello XXXX, Upon checking your order, the order is cancelled due to xxxx I recommend reordering the part again and sending us a new form. If you have any further questions, don’t hesitate to contact us. Hope you have a great day.','exceptions','published','BlueLight Cases-combined.pdf','7–9',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-cancelled-order','Cancelled order','cancelled-order');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-cancelled-order');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-rejections','Rejections','rejections');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-rejections');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-uk-sap','UK SAP','uk-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-uk-sap');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-factory-notes','Factory notes','factory-notes');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-factory-notes');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-texts-tab','Texts tab','texts-tab');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-texts-tab');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-do-not-expedite','Do not expedite','do-not-expedite');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-do-not-expedite');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-reorder','Reorder','reorder');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-004','tag-reorder');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-005','car-hire-process-pekb-005','CAR Hire Process','The extra Replacement vehicle request steps when raising a Car Down ETA chase.','## Car Down
When sending off an ETA chaser for Car Down, follow the same steps as sending off a normal ETA chaser. There are a few extra steps at the end before selecting Update reminder.
- Select the normal triangle to open the OTLG request.
- Fill in all the required information, then select the Replacement vehicle request button. The source notes that the button may appear greyed out but can still be clicked.
- Confirm that you want to create a replacement vehicle request.
- Complete the additional questions.

## Required vehicle information
Always make sure that you fill in the license plate, mileage and damage, and tick the boxes highlighted in red. The information should be available on the E-form. If it is a call, obtain the required information and fill it in.

## Complete the request
- Click Update reminder at the bottom right of the page.
- Once the request is complete, it closes and a car icon appears on the request to indicate that hire is provided or requested and that it is a higher priority.
- The triangle is replaced with the car icon.
- If Car Down is greyed out and cannot be selected, send the details to your manager so there is a trail to fall back on.','mobility','published','BlueLight Cases-combined.pdf','10–12',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-car-hire');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-car-down','Car Down','car-down');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-car-down');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-replacement-vehicle','Replacement vehicle','replacement-vehicle');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-replacement-vehicle');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-otlg');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-license-plate','License plate','license-plate');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-license-plate');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-mileage','Mileage','mileage');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-mileage');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-damage','Damage','damage');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-005','tag-damage');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-006','csc-feedback-pekb-006','CSC Feedback','When to record CSC Feedback and how to open the feedback form from a Salesforce case.','When logging a case, there is an option to write a CSC Feedback, which is our feedback about an interaction. We don''t use it on each case, we only use it if there is a complaint, feedback, wrong information provided, or if we got a call from a retailer that they were really exceptionally good.

## How to Write CSC Feedback
To open the case page, you can do that by clicking on the hyper link of the quick log once you reach the last quick log screen

On the Case Screen you will find at the top of the Case view a bottun "CSC Feedback"

Once you precc on CSC Feedback, this window will pop-up

## When to use CSC Feedback

If the retailer has bad attitude If the retailer sent wrong info If the retialer was exceptionally good on a call. then we can still use it for positive feedback.','calls','published','BlueLight Cases-combined.pdf','13–14',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-csc-feedback','CSC Feedback','csc-feedback');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-csc-feedback');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-salesforce','Salesforce','salesforce');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-salesforce');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-case-feedback','Case feedback','case-feedback');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-case-feedback');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-complaint','Complaint','complaint');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-complaint');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-wrong-information','Wrong information','wrong-information');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-wrong-information');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-positive-feedback','Positive feedback','positive-feedback');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-006','tag-positive-feedback');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-007','delivered-in-dordon-pekb-007','Delivered in Dordon','How to recognise a part being processed in Dordon and explain the expected 24–48 hour delivery window.','## Identifying
- In this case, the part says in document flow in the second line ''Delivery'', it means that it has arrived in Dordon and is being processed.

## Process
- In this case you should not be able to prioritise the part as it''ll be most probably greyed out, if it is not, we should always prioritise.
- We inform the partner that the order is being processed in Dordon, so prioritizing the order is not possible anymore, and that he should expect the part within 24-48 hours.

## Template example
Hello XXXX, Upon checking the order, the part is being processed in Dordon, and prioritising is not possible anymore. You should expect the part within 24-48 hours. If you have any further questions, don’t hesitate to contact us. Have a great day!

Kind regards','delivery','published','BlueLight Cases-combined.pdf','15–16',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-dordon','Dordon','dordon');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-dordon');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-document-flow','Document flow','document-flow');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-document-flow');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-delivery','Delivery','delivery');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-delivery');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-24-48-hours','24–48 hours','24-48-hours');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-24-48-hours');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-eta','ETA','eta');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-eta');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-prioritisation','Prioritisation','prioritisation');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-007','tag-prioritisation');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-008','delivery-block-ru3-pekb-008','Delivery Block (RU3)','How to identify an RU3 delivery block in ZP14 and request an ETA from OTLG UK Backorders.','When checking an Order, that shows that it has a delivery Block.

In order to investigate that Block. First > you go to ZP14 screen for the part no. If the Block showing under the (SEGMENT2&3 Material) is "RU3", that means that it''s under Russian sanction. example below :>

In this case :>
1. Send an email to (OTLG UK Backorder UK-Backorder@volkswagen-otlg.de) for an ETA.
2. include the all the info in the mail such as (Order no. \ Part no. \ RDC no. \ VIN no. )
3. once they reply back, in most cases they will remove the block from the order, in that case you can get back to the retailer with info about the ETA shared by OTLG.','exceptions','published','BlueLight Cases-combined.pdf','19–20',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-ru3','RU3','ru3');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-ru3');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-delivery-block','Delivery block','delivery-block');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-delivery-block');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-zp14','ZP14','zp14');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-zp14');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-russian-sanction','Russian sanction','russian-sanction');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-russian-sanction');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-uk-backorder','UK-Backorder','uk-backorder');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-uk-backorder');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-otlg');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-008','tag-eta');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-009','different-supplier-pekb-009','Different supplier','Which OTLG email address to use when the ZP14 supplier is not VW, SEAT or ŠKODA.','In case you see on ZP14 the supplier is not VW, Seat or Skoda, if you are requesting an ETA so you should send an email to OTLGCDIUK.VWZandTools@volkswagen-otlg.de, and not to UK-Backorder@volkswagen-otlg.de','parts','published','BlueLight Cases-combined.pdf','23',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-different-supplier','Different supplier','different-supplier');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-different-supplier');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-zp14');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-supplier','Supplier','supplier');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-supplier');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-otlg');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-accessories','Accessories','accessories');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-accessories');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vw','VW','vw');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-vw');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-seat','SEAT','seat');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-seat');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-skoda','ŠKODA','skoda');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-009','tag-skoda');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-010','exchange-part-pekb-010','Exchange Part','How to identify an exchange part ending in X, derive its predecessor part number and explain the available alternative.','## Identifying
- It is when the part ends with X, ex: 4KE-915-253-QX.

## Process
- For this part, it has a predecessor in the predecessor field (4KE-915-253-PX).
- Remove the X from the predecessor part so the part will be: 4KE-915-253-P and advise with the availability and to claim warranty from the Email that you will send as (use this email as confirmation for warranty if part is compatible).

## Template example
Hello XXX
I have checked the order, this part (xxx) is (xxinsert part statusxx), and there is no ETA provided at the moment. I have prioritized it for you and sent an ETA chase on PARDS.

However, there is available stock of the new version of its predecessor part (4KE-915-253-P), not the exchange. If you choose to cancel the current order and place a new one with the part 4KE-915-253-P it should be delivered within (xxinsert SLAxx).
If you have any other questions, feel free to reach out at any time.
Have a nice day!
Kind regards','parts','published','BlueLight Cases-combined.pdf','25–26',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-exchange-part','Exchange part','exchange-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-exchange-part');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-part-number-ending-x','Part number ending X','part-number-ending-x');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-part-number-ending-x');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-predecessor','Predecessor','predecessor');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-predecessor');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-part-availability','Part availability','part-availability');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-part-availability');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-warranty','Warranty','warranty');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-warranty');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-alternative-part','Alternative part','alternative-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-alternative-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-010','tag-pards');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-011','expedite-with-mobility-pekb-011','Expedite with Mobility','Mobility scenarios for an absent or incomplete DISS report and for a vehicle that is out of warranty.','## No DISS report / DISS report is not updated — vehicle is in warranty / battery warranty
### Identifying
- When checking ElsaPro > DISS Monitor for a DISS report and there is none, or the DISS report is not updated or completed.
### Process
- Still prioritise it to a (2).
- Coach the retailer and advise them to update the DISS report, as it is crucial for the mobility request to go through.
### Template example
Hello xxxx,
Upon checking the order, [enter ETA details]. [Enter action taken details].
Kindly make sure to update / submit / upload a DISS report, as it is important for the mobility request to go through.
[Closure]

## Car is out of warranty
### Identifying
- When checking the car’s warranty on VMS (check the vehicle home page and Vehicle Policies for extended warranty) and finding that there is no warranty coverage for the car.
### Process
- Expedite to a (3).
- Coach the retailer and tell them that the mobility request will not go through as long as the car is out of warranty.
### Template example
Hello xxxx,
Upon checking the order, [enter ETA details]. [Enter action taken details].
Please note that due to the vehicle being out of warranty, the mobility request will not go through.
[Closure]','mobility','published','BlueLight Cases-combined.pdf','29–31',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-one-mobility','One Mobility','one-mobility');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-one-mobility');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-diss-report','DISS report','diss-report');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-diss-report');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-elsapro','ElsaPro','elsapro');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-elsapro');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vms','VMS','vms');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-vms');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-warranty');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-battery-warranty','Battery warranty','battery-warranty');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-battery-warranty');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-priority-2');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-011','tag-priority-3');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-012','factory-dates-pekb-012','Factory Dates','What the factory date codes indicate and how to handle an ETA request for technical clarification or supply failure.','## Identifying
- Example date (10/6/5555): means supply failure, or the part is in technical clarification / something related to the supplier and so we check PARDS for an ETA / will mention on SAP in next delivery date.
- Example date (10/6/4444): this is when they will be able to clear the bottleneck.
- Example date (10/6/6666): means no manufacture until after the mentioned day and month.
- Example date (10/6/2026): normal next delivery date to the factory
- No date at all: meaning either there''s no contract, there is enough stock and the part ordering volume is low or it''s a normal backorder with no specific date provided from the supplier.

## Process
- Expedite the part to a (3) or a (2) depending on whether there is a mobility request or not.
- Requesting ETA through PARDS and informing the retailer about the issue.

Template Ex: Hi xxxx, For the part requested, it’s currently in technical clarification. I have already

prioritised the part and requested an ETA on PARDS. If you have any questions kindly reach out. Have a great day. Kind regards

Or

Hello xxxx, For the part requested, it’s currently being managed by the Bottleneck Management Team as there is supply failure. I have prioritised the part and requested an ETA on PARDS. If you have any questions kindly reach out. Have a great day. Kind regards','backorders','published','BlueLight Cases-combined.pdf','32–33',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-factory-dates','Factory dates','factory-dates');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-factory-dates');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-10-6-5555','10/6/5555','10-6-5555');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-10-6-5555');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-10-6-4444','10/6/4444','10-6-4444');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-10-6-4444');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-10-6-6666','10/6/6666','10-6-6666');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-10-6-6666');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-supply-failure','Supply failure','supply-failure');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-supply-failure');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-technical-clarification','Technical clarification','technical-clarification');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-technical-clarification');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-012','tag-pards');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-013','gast-wv4-wv5-pekb-013','GAST WV4 WV5','How to identify Ford-built WV4/WV5 vehicles and escalate a backordered part through the Parts Orders team.','## Identifying
- They are Vehicles that have Ford chassis (Amarok \ Transporter)
- Vin starts with WV4 / WV5

## Process
- Check if the vehicle is a VOR and the chassis is WV4/WV5 for Ford.
- Check the availability of the part using factory systems.
- Change the priority of the order to a 3 or 2 depending on the mobility request.
- If no eta and the part is on factory back order (FBO) or the eta is greater than 5 working days raise with the ( VWGUK R: Milton Keynes, Parts Orders PartsOrders@volkswagen.de) team. Parts Team will then investigate this and raise a GAST ticket to an alternative part and approval from warranty to use the alternative or source the part from Ford direct
- Send a PARDS reminder.
- Email RDC with update informing them that the part is on FBO and that an alternative is being looked at, put the e-form in a separate inbox.
- Await a response from the parts team and then update the retailer again.

Template Ex:

To: Partsorders@vwg.co.uk EX: Hello Team This is a FORD built vehicle, according to factory (ETA is xx/xx/xx or It is Factory Back Order) Please can you check for a larger assembly and or raise a GAST ticket for an ETA for this part number xxxxxxx? The order is xxxx VIN xxxx Retailer email xxxx

If no ETA, can we obtain permission from warranty to use a bigger assembly or source directly from FORD

Kind regards.','mobility','published','BlueLight Cases-combined.pdf','36–37',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-gast','GAST','gast');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-gast');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-wv4','WV4','wv4');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-wv4');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-wv5','WV5','wv5');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-wv5');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-ford-chassis','Ford chassis','ford-chassis');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-ford-chassis');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-amarok','Amarok','amarok');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-amarok');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-transporter','Transporter','transporter');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-transporter');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-factory-backorder');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-partsorders','PartsOrders','partsorders');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-013','tag-partsorders');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-014','german-sap-pekb-014','German SAP','German SAP sign-in and the basic screens used to check parts and order status.','## Sign in
- Right click on German SAP the choose SNC Logon without Single Sign-on

Enter your:
- User
- password

- The in the command field type ZZgn04_Zpit

## Checking parts
- In the material section type the part number for the part info to appear

## Checking Order Status
- Click on List of sales order at the top of the page

- Then Enter the part number in the material section, choose preferred date and select all orders','systems','published','BlueLight Cases-combined.pdf','38–40',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-german-sap','German SAP','german-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-german-sap');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-zzgn04-zpit','ZZgn04_Zpit','zzgn04-zpit');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-zzgn04-zpit');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-snc-logon','SNC Logon','snc-logon');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-snc-logon');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-material','Material','material');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-material');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-list-of-sales-orders','List of sales orders','list-of-sales-orders');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-list-of-sales-orders');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-order-status','Order status','order-status');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-014','tag-order-status');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-015','how-edit-quick-logs-pekb-015','How Edit Quick logs','How to change case classifications in Salesforce Quick Logs and refresh the case.','## A. How to edit case classification
1. Click on the case the choose case catogories

2. Then click on Delete for remove the classification

3. Then Write the classification keyword to appear

4. Confirm all levels are correct then select the classification you want then click add to case

5. Refresh the page and it will be updated','calls','published','BlueLight Cases-combined.pdf','41–42',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-salesforce');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-quick-logs','Quick logs','quick-logs');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-quick-logs');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-case-classification','Case classification','case-classification');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-case-classification');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-case-categories','Case categories','case-categories');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-case-categories');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-add-to-case','Add to case','add-to-case');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-add-to-case');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-refresh','Refresh','refresh');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-015','tag-refresh');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-016','order-in-dordon-but-out-of-sla-pekb-016','Order in Dordon but out of SLA','What to do when UK SAP shows a part delivered to Dordon but it has not reached the retailer within the 24–48 hour SLA.','## Identifying
- When part is in Dordon for more than the expected SLA (24-48 hours)

## Process
- If a retailer contacted us to check on an ETA, and we found that the part is confirmed on UK SAP but the document flow shows that it''s been delivered to Dordon, yet it''s taking more than 24-48 hours to be delivered to the retailer, we do the following (screenshots for reference):

1. Either transfer the retailer/caller to Parts FL (Frontline) via warm transfer
2. Or ask the retailer to contact Parts FL via email at partsorders@vwg.co.uk and they will be able to contact Dordon and follow up on the part status from their end.
3. Or ask the retailer to contact the PDR via this email warehouse_pdr@vwg.co.uk.

Template Ex:

Hello xxx, upon checking the order for you, the part has arrived to Dordon, however it is out of SLA. In this case, it''s advised to reach out to the Parts frontline via email at partsorders@vwg.co.uk and follow up on the part status or you can contact the PDR via this email warehouse_pdr@vwg.co.uk. as well. If you have any further questions, do not hesitate to reach out. Have a nice day ahead! Kind regards','delivery','published','BlueLight Cases-combined.pdf','43–44',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-dordon');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-out-of-sla','Out of SLA','out-of-sla');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-out-of-sla');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-24-48-hours');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-parts-fl','Parts FL','parts-fl');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-parts-fl');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-partsorders');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-pdr','PDR','pdr');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-pdr');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-warehouse-pdr','Warehouse PDR','warehouse-pdr');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-016','tag-warehouse-pdr');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-017','order-not-showing-on-pards-pekb-017','Order not showing on PARDS','How to handle orders that cannot be found on PARDS or where a new reminder is blocked, including the correct email route.','## Identifying
- When trying to look for a part using the RDC number + Order number and it is not showing on PARDS.
- The source also describes cases where the part is showing on PARDS but sending a new reminder is blocked.

## Process
- Expedite to a 3 or a 2 depending on whether there is a mobility request or not.
- Identify the part and check if it is a tool or an accessory:
- If it is a tool / accessory, send an ETA chase email to OTLGCDIUK.VWZandTools@volkswagen-otlg.de.
- If it is a genuine part, send an ETA chase email to UK-Backorder@volkswagen-otlg.de.
- Include the order number, part number and VIN if possible.
- Get an email address from the caller so you can get back to them later when OTLG replies.

## Template example
Example email to send to OTLG:
Hello Team,
Please provide an ETA for this part:
- Order number:
- Part number:
- VIN:
Thank you in advance!
Kind regards

## What to tell the retailer
Tell the retailer that the part is on backorder / bottleneck as usual, but instead of asking them to check PARDS, explain that the ETA is being chased by email and that we will get back to them once inventory replies.

## Example email when the order is not visible
Hello Team,
I found that the order below is not showing on PARDS.
Would you kindly provide an ETA for this part?
RDC: 21025077
Order number: 53205478
Part number: ZGB-CJ5-017- -221
VIN: TMBMP8NZ3TC065740
Kindly find below the screenshot from PARDS.','backorders','published','BlueLight Cases-combined.pdf','45–47',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-pards');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-order-not-found','Order not found','order-not-found');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-order-not-found');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-reminder-blocked','Reminder blocked','reminder-blocked');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-reminder-blocked');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-otlg');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-genuine-parts','Genuine parts','genuine-parts');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-genuine-parts');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-accessories');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-tools','Tools','tools');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-tools');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-017','tag-eta-chase');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-018','pards-otlg-pekb-018','PARDS (OTLG)','How to find an order in PARDS, review partner comments and submit an ETA chase or Car Down request.','## Purpose
Check PARDS for ETA updates and Hotlines about the part.

## Search for the retailer
To search an order in PARDS (OTLG), first search for the retailer number in the top-left section.
Then select the relevant order from the list of orders made by that retailer.

## Locate the order and part
Search the filters using the order number. Match the order with the part number in case there are multiple parts on the same order.

## Review the partner request
Click the Partner request icon. If there is a recent comment about part availability, use that comment as a source of information.
If there is no comment and the part has no ETA, send an ETA chase request to PARDS.

## Send an ETA chase request
On the following screen, fill in the request details according to the request type:
- Customer Care Escalation if the request does not come with car hire.
- Car Down if the request comes with a car hire from One Mobility.

## Important note
The “type of order” (ZAPM) is not editable on PARDS.
Select the Car Down tick and mention in the description that a replacement vehicle is requested. The source describes this as a case where there is car hire but the replacement request is dimmed.','systems','published','BlueLight Cases-combined.pdf','48–49',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-pards');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-otlg');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-partner-request','Partner request','partner-request');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-partner-request');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-retailer-number','Retailer number','retailer-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-retailer-number');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-order-number','Order number','order-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-order-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-eta-chase');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-car-down');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-customer-care-escalation','Customer Care Escalation','customer-care-escalation');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-018','tag-customer-care-escalation');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-019','packing-process-pekb-019','Packing process','How the Packing needed flag and available stock affect the delivery estimate and when to check PARDS.','## Process
- if there''s next delivery date mentioned and packing needed is checked, another 2 weeks are added on top of the normal delivery date but should send PARDS because there might be a delivery delay by supplier
- if a part showing in packing process and there''s no stock, advise the retailer that ETA is 2-3 weeks as it is in packing process
- if stock available and packing needed is NOT checked so there''s no need to add another 2 weeks as the stock available is already packed.
- If stock is available, some parts are in the packing section, check the order list to see the status of the order if it is confirmed or not, if cannot make sure, check PARDS.

## Examples
in this example the order has Packing needed check box ticked, and no stock with a next delivery date. in this case, the delivery should be, 2-3 weeks .

For this example in this case, another 2 weeks are added on top of the normal delivery date and check PARDS for accurate ETA

3rd Example For this case, since there is available stock and there is in packing process as well, in this case, we would advise with normal 3-5 working days for delivery.

## Template
Hello xxxx, For the part requested, it’s currently in packing process in the factory, I prioritised the part and ETA is 2-3 weeks. If you have any questions kindly reach out. Have a great day. Kind regards','delivery','published','BlueLight Cases-combined.pdf','50–53',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-packing-process','Packing process','packing-process');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-packing-process');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-packing-needed','Packing needed','packing-needed');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-packing-needed');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-next-delivery-date','Next delivery date','next-delivery-date');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-next-delivery-date');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-factory-stock','Factory stock','factory-stock');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-factory-stock');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-2-3-weeks','2–3 weeks','2-3-weeks');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-2-3-weeks');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-3-5-working-days','3–5 working days','3-5-working-days');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-3-5-working-days');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-019','tag-pards');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-020','part-in-stock-pekb-020','Part in Stock','How to check factory or Dordon stock and use the source location to advise the corresponding ETA.','## Identifying
If the order is in stock in Drodon \ showing in the ZP 14 as DISP. stock If the order is in stock in the Factory (German SAP\Spain SAP\Sokda Portal)

## Process
- Expedite the part to (3) if there is no mobility request and to (2) if there is a mobility request.
- If the Part in stock in Drodon, the ETA should be 24-48 hours.
- IF the Part in stock in Kassel the ETA should be 3-5 Working days
- If the Part in stock in Spain the ETA should be 5-7 working days
- IF the Part in stock in Czech it should be 7-10 working days
- Advise the retailer with the ETA for the part, according to where it''s being delivered from.

Template Ex: Hello XXXX, Upon checking your order, the part is on factory backorder. I have prioritized the order and sent an ETA chase request to PARDS.

I recommend keeping an eye on PARDS for ETA updates within the next 24-48 hours. If you have any further questions, don’t hesitate to contact us. Hope you have a great day.

Kind regards','stock','published','BlueLight Cases-combined.pdf','54–55',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-part-in-stock','Part in Stock','part-in-stock');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-part-in-stock');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-dordon');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-kassel','Kassel','kassel');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-kassel');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-spain','Spain','spain');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-spain');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-czech','Czech','czech');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-czech');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-zp14');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-disp-stock','DISP. stock','disp-stock');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-disp-stock');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-delivery-eta','Delivery ETA','delivery-eta');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-020','tag-delivery-eta');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-021','sales-purchase-data-as-alv-pekb-021','Sales/Purchase-Data as ALV','How to use Sales-/Purchase-data as ALV in ZP14 to check incoming stock and order allocation.','If an order is confirmed in German SAP but there is no available stock and it is not showing as a backorder, or the order is not confirmed and there is stock, you can verify the allocation of incoming stock by:

- Opening ZP14.
- Selecting Sales-/Purchase-data as ALV (top right).

Check the Date & the Order Quantity in Transit field. This shows incoming stock that is on its way to Dordon and helps identify which order the part is allocated to when multiple orders exist.','stock','published','BlueLight Cases-combined.pdf','56–57',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-sales-purchase-data-as-alv','Sales/Purchase-Data as ALV','sales-purchase-data-as-alv');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-sales-purchase-data-as-alv');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-zp14');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-order-quantity-in-transit','Order Quantity in Transit','order-quantity-in-transit');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-order-quantity-in-transit');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-incoming-stock','Incoming stock','incoming-stock');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-incoming-stock');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-allocation','Allocation','allocation');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-allocation');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-021','tag-german-sap');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-022','salesforce-quick-logs-pekb-022','Salesforce (Quick-Logs)','E-form and call Quick Log classifications, required fields and guidance for internal callers and One Mobility.','## E-form quick log

### A. E-form without mobility
1. Group Ops
2. Enter the needed details:
- Brand (check the brand using the VIN on VMS)
- Case Origin (email)
- Business Area (Parts)
- Subject (VIN - All capitalized)
- Description (Order number + a detailed description of the case and what actions were taken)
3. Enter RDC or TPS number
4. Classification levels:
- L1: Group Operations - Parts
- L2: Expediting
- L3: Expedite
- L4: No Additional Classifications
5. Click ''Next'' after reviewing the classifications

6. Reference Type (Expediting Request Ref)
7. For reference number, enter the part number (capitalized with the dashes)
8. Duration (leave it 0 as is)
9. Finish

### B. E-form with mobility
All steps are the same, the only difference is in classification, it should be as followed:
- L1: Group Operations - Parts
- L2: Expediting
- L3: Expedite with mobility
- L4: No Additional Classifications

### C. E-form with incorrect info
L1: Group Operations - Parts L2: Expedite/Expedite with Mobility L3: Invalid Information Provided

### D. Call with incorrect info
L1: Group Operations - Parts L2: Parts Enquiry L3: Invalid information provided

### E. Wrong department trying to expedite
Put Wrong department in the Subject line L1: Group Operations - Parts L2: Other L3: Avoidable Contact L4: Wrong Department

### F. ETA chase from CSC or RDC
Operations- Parts Parts Ordering ETA

### G. Stock availability calls
Group Operations - Parts Parts Ordering Stock Availability

## Calls quick log

ETA chase
1. Group Ops
2. Enter the needed details:
- Brand (check the brand using the VIN on VMS)

- Case Origin (Phone In)
- Business Area (Parts)
- Subject (Order number)
- Description (a detailed description of the call and what actions were taken and what are the next steps - if needed-)
3. In RDC number enter:
- RDC or TPS number if the caller is from network or a TPS
- ''CSC'' if it''s any internal team
- ''AA'' if it''s a One Mobility rep.
4. Classification levels (RDC - CSC):
- L1: Group Operations - Parts
- L2: Part Ordering
- L3: ETA
- L4: No Additional Classifications
4. Classification levels (AA):
- L1: Group Operations - Parts
- L2: AA Contact
- L3: Part ETA
- L4: No Additional Classifications
5. Click ''Next'' after reviewing the classifications
6. Reference Type (ETA ref.)
7. For reference number, enter the part number (capitalized with the dashes)
8. Duration (leave it 0 as is)
9. Finish

Side note 🚔

1-We choose the classifications according to the enquiry we receive, not for the actions we take Example: If we receive an E-form with One Mobility, but there is no DISS report, or the car is out of warranty, or for any reason, we won''t be able to change the priority to 2 as the process should be in a normal scenario, so we go instead with priority 3, in that case, we still choose the classification Expedite with One Mobility, as this is what the enquiry we received was for, and we explain in the description that the reason we did not choose 2

2- Whenever you receive a call from AA: put AA in the RDC Number Box

3- Whenever you receive a call from Executive Office – BLM – Customer Care – Brand Support: Put CSC in the RDC Number Box

4- If you receive a call from any department and they are asking to expedite an order: if they have all the needed info to make a full E-form quick log “RDC Number – VIN – Order Number – Part Number”, Expedite the order with coaching him to inform the RDC that he has to submit an E-form for it as well, as to keep all departments aligned, and put the RDC Number linked to the order “that should be the same one provided by the caller as well” in the RDC Number box','calls','published','BlueLight Cases-combined.pdf','58–62',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-salesforce');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-e-form');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-quick-log');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-classification-levels','Classification levels','classification-levels');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-classification-levels');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-rdc');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-csc','CSC','csc');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-csc');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-aa','AA','aa');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-aa');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-eta-chase');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-stock-availability','Stock availability','stock-availability');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-022','tag-stock-availability');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-023','spanish-sap-pekb-023','Spanish SAP','Spanish SAP sign-in and the steps to display material information and quantity.','## Sign in

Enter your:
- User
- password

## Check Material Status
Click on Material information

Enter the part number in the Material section the click on Execute button or F8 on the keyboard

Material Information and quantity will appear','systems','published','BlueLight Cases-combined.pdf','63–65',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-spanish-sap','Spanish SAP','spanish-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-spanish-sap');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-material-information','Material Information','material-information');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-material-information');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-part-number','Part number','part-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-part-number');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-execute','Execute','execute');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-execute');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-f8','F8','f8');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-f8');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-stock-quantity','Stock quantity','stock-quantity');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-023','tag-stock-quantity');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-024','special-cases-pekb-024','Special cases','A grouped reference for exchange parts, incorrect order numbers, delayed Dordon deliveries and returned parts.','## Table of contents
### Exchange Part
### Incorrect order number
### Order arrives in Dordon but has not been delivered within SLA
### Part has been returned (Advance Return action in the Doc Flow)

### Exchange Part
- It is when the part ends with X, ex: 4KE-915-253-QX,
- There will be another part number "the exchange" in the predecessor field (4KE-915-253-PX).
- Remove the X from the predecessor part so the part will be: 4KE-915-253-P and advise with the availability and to claim warranty from the Email that you will send as (use this email as confirmation for warranty if part is compatible).

### Incorrect order number
- When the Part number provided in the E-Form does not match the parts in the order, check the part number on "List of sales order".

- Verify that this order matches the following on the order provided in the E-Form:
1. Retailer number
2. Part description
3. PO date
4. Quantity

### Order arrives in Dordon but has not been delivered within SLA

- If a retailer contacted us to check on an ETA, and we found that the part is confirmed on UK SAP but the document flow shows that it''s been delivered to Dordon, yet it''s taking more than 24-48 hours to be delivered to the retailer, we do the following (screenshots for reference):

1. Either transfer the retailer/caller to Parts FL via warm transfer
2. Or ask the retailer to contact Parts FL via email at partsorders@vwg.co.uk and they will be able to contact Dordon and follow up on the part status from their end.
3. Or ask the retailer to contact the PDR via this email warehouse_pdr@vwg.co.uk.

### Part has been returned (Advance Return action in the Doc Flow)
- If we find in the part''s document flow that it has been returned, direct the retailer to contact the PDR, their email address is warehouse_pdr@vwg.co.uk.','exceptions','published','BlueLight Cases-combined.pdf','66–68',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-special-cases','Special cases','special-cases');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-special-cases');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-exchange-part');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-incorrect-order-number','Incorrect order number','incorrect-order-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-incorrect-order-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-dordon');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-returned-part','Returned part','returned-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-returned-part');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-advance-return','Advance Return','advance-return');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-advance-return');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-doc-flow','Doc Flow','doc-flow');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-doc-flow');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-024','tag-pdr');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-025','supersession-cases-pekb-025','Supersession Cases','How to handle a part with a predecessor or successor, including when to advise an alternative part.','## Identifying
- Supersession is when there is a part that has either a predecessor, or a successor, "a newer or an older version of the same part"

## Process
The process in this regard is divided into 2 scenarios:
- So in both cases the current part is not available, either because there is factory backorder, bottleneck management..etc. Therefore, you''ll be sending to PARDS in both cases requesting ETA "they have access to SAP, so they''re aware that the part has either a predecessor or a successor, and they will advise cancelling the order and order the predecessor or the successor, if it is available"
- We are going to expedite the current part for both cases as well to either 3 or 2 depending on the Car hire situation.

### The part has a predecessor “an older version”
- In this case, the logical thing to do is ignore the predecessor as it''ll most probably be unavailable anymore, hence they have created a successor for it, which is the part you''re investigating
- Investigating the part is still mandatory to check whether it is still being manufactured or not, so unless the predecessor has stock, with no

backorders or any issues, you should just ignore the predecessor EXCEPTION: if the current part states in the comments to ignore it and order the predecessor, only then will we mention it to the partner.
- Send on PARDS asking for ETA for your current part.
- Inform the partner of the reason for the part''s delay, that you''ve requested ETA from OTLG, and ignore mentioning the predecessor, OTLG will mention it if it is available, so he''ll be notified, you''ll inform him that you have prioritized the current part as well.

## Template example

#### If there is no comment stating to order the predecessor
Hello XXXX,

For the part requested, it’s currently XWelMentionlThelStatuslOflThelCurrentlPartX. I have already prioritized it and requested ETA from OTLG. Kindly check PARDS for updates..

If you have any questions, do not hesitate to reach out.

Have a great day!

Kind regards

#### If there is no comment stating to order the predecessor
Hello XXXX,

For the part requested, it’s currently XWelMentionlThelStatuslOflThelCurrentlPartX. I have already prioritized it and requested ETA from OTLG. Kindly check PARDS for updates.. However, the part 4KE-915-253-P is available in stock, you can order it as an alternative and cancel the current order. if you decide to order the alternative, kindly submit an E-form afterwards, so we can prioritise it for you.

If you have any questions, do not hesitate to reach out.

Have a great day!

Kind regards

### The part has a successor “a newer version”
- In this case, we do the opposite, it is advisable to check out the successor, as they have manufactured a newer version for a reason, it might be available, or it might not be.
- Whether it is available or not, we are going to request ETA from OTLG for the current part.
- Here, we will inform the partner that of the reason for the part''s delay, that you''ve requested ETA from OTLG, and that you have prioritized the current part as well, you''ll advise him in this case that there''s a successor for the part they ordered, what its status and that regardless whether it is available or factory backordered, it is still better to order the successor rather than the current part, as it''ll most probably still be available, enhanced and will reach him quicker.

## Template example

#### The part has a successor
Hello XXXX,

For the part requested, it’s currently XWelMentionlThelStatuslOflThelCurrentlPartX. I have already prioritized it and requested ETA from OTLG. Kindly check PARDS for updates.. However, there''s a successor part 4KE-915-253-P is XWelMentionlThelStatuslOflThelsuccessorlPartX, it is advisable to order it as an alternative and cancel the current order, as it should reach you quicker. if you decide to order it, kindly submit an E-form afterwards, so we can prioritise it for you.

If you have any questions, do not hesitate to reach out.

Have a great day!

Kind regards','parts','published','BlueLight Cases-combined.pdf','69–72',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-supersession','Supersession','supersession');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-supersession');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-predecessor');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-successor','Successor','successor');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-successor');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-older-version','Older version','older-version');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-older-version');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-newer-version','Newer version','newer-version');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-newer-version');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-pards');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-alternative-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-025','tag-eta');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-026','uk-sap-pekb-026','UK SAP','UK SAP sign-in, common navigation options and the main transactions used for order and material checks.','## Sign in

Enter your:
- User
- password

## Header most used options

Enter

Command Field

Save

Back (F3)

Exit (shift+f3)

Cancel (12)

New page

Sap Easy Access

⭐ Sales Orders -> Change Sales Order
- You enter the order number in the order section

⭐ VA05 - Sales Orders -> List of Sales Orders Enter the part number in the material section, adjust the document date as preferred and select all orders to check the order list

⭐ VA03 - Sales Orders -> Display Sales Order You can check the order info without adjusting anything from Display sales order by entering the order number in the order section

⭐ Material Information -> ZP14 You can check the stock in Dordon through Material Information by entering the part number in the material section

⭐ MM03 Display Material You can check what factory you can find the part you need by entering the part number in the material section then choosing Extended View Mara the confirm','systems','published','BlueLight Cases-combined.pdf','73–77',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-uk-sap');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-va05','VA05','va05');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-va05');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-va03','VA03','va03');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-va03');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-zp14');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-mm03','MM03','mm03');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-mm03');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-change-sales-order','Change Sales Order','change-sales-order');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-change-sales-order');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-material-information');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-026','tag-list-of-sales-orders');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-027','vms-pekb-027','VMS','How to open VMS, search by VIN or registration and view vehicle details, history and policies.','## Sign in
- Enter VMS through GRP.
- Once it opens, click “Accept”.

## Search for a vehicle
- On the Search page, enter either the VIN / Chassis number or the Registration number.

## Vehicle details
- The vehicle page includes details such as model, activation date, registration number and warranty.
- Click Vehicle History to view the vehicle’s checks and services done so far.
- Click Vehicle Policies to view extended warranties, servicing plans and other policies.','systems','published','BlueLight Cases-combined.pdf','78–81',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-vms');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-grp','GRP','grp');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-grp');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vin','VIN','vin');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-vin');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-chassis-number','Chassis number','chassis-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-chassis-number');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-registration-number','Registration number','registration-number');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-registration-number');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vehicle-history','Vehicle History','vehicle-history');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-vehicle-history');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-vehicle-policies','Vehicle Policies','vehicle-policies');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-vehicle-policies');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-027','tag-warranty');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-028','volume-orders-accessories-tools-pekb-028','Volume orders /Accessories /Tools','How to identify volume orders, decide whether tools or accessories should be expedited and check whether a tool can be borrowed.','## Identifying
## Volume orders
- Tools and accessories: the part number comes with the 4th digits it will be a 0 or and starting with "ZGB", some control units come with the fourth number as zero, however it is not an accessory, and it will be expedited.
- Genuine parts: there are some parts that cannot be ordered as a special order, it can only be ordered as a volume order such as some kind of batteries and control unit.

## Process
- Important Note: We do not expedite accessories or tools orders *unless it is urgent*, or it is a genuine part that cannot be ordered as a special order.
- If the part has been ordered as a volume order, we advise the retailer to cancel the order and reorder it as a special order.
## How to check whether a part can be ordered as a special order
- By checking list of sales orders on UK SAP and checking pervious orders type if that part can be ordered as a special order, we can advise the retailer to reorder correctly as a special order.
- (prioritizing the volume orders no matter what the priority is will always be delivered after the special orders)

Notes :
## FYI
- some scenarios the retailer can see that the order got delivered by having a green dot on their end, however it means that it got delivered to the third-party company but not yet delivered to the factory, in this case we should send a PARDS reminder in case it is there on the PARDS system or we can send them an email requesting an ETA. :>(OTLGCDIUK.VWZandTools@volkswagen-otlg.de)

## Tools
- (Tools info Web) can be used to check other retailers and TPSs, if they got the tool in the order, so they can borrow it until they get the tool ordered

Example of an Urgent tool, that can be expedited.','parts','published','BlueLight Cases-combined.pdf','82–83',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-volume-orders','Volume orders','volume-orders');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-volume-orders');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-accessories');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-tools');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-special-order','Special order','special-order');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-special-order');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-urgent-tool','Urgent tool','urgent-tool');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-urgent-tool');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-zgb','ZGB','zgb');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-zgb');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-third-party-delivery','Third-party delivery','third-party-delivery');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-third-party-delivery');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-tools-info-web','Tools info Web','tools-info-web');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-028','tag-tools-info-web');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-029','zint-zinl-pekb-029','ZINT \ ZINL','How to identify ZINT/ZINL orders and use the factory order completion status to decide whether to chase an ETA.','## Identifying
It can be known if the order is ZINL or ZINT under the (ItCa) section where you can find it Change of Sales Orders page in UK SAP.

## Process
- Check the order on list sales orders on the factory system (German SAP, Spanish SAP).
- If the order is completed (c), it will be handled at the usual ETA.
- If the order shows it is not completed (A), Send an ETA Chase to PARDS even if it shows that the Basic part is in stock.
- Advise the retailer that there is no ETA for the part, and that we sent an ETA chase request, and let the retailer know that they need to check PARDS for ETA updates.

Template Ex: Hello XXXX, Upon checking your order, the part is on the factory back order. I have prioritized the order and sent an ETA chase request to PARDS. I recommend keeping an eye on PARDS for ETA updates within the next 24-48 hours.

If you have any further questions, don’t hesitate to contact us. Hope you have a great day.

Kind regards','delivery','published','BlueLight Cases-combined.pdf','84–85',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-zint','ZINT','zint');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-zint');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-zinl','ZINL','zinl');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-zinl');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-itca','ItCa','itca');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-itca');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-uk-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-german-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-spanish-sap');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-pards');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-factory-order','Factory order','factory-order');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-029','tag-factory-order');
INSERT OR IGNORE INTO articles (id,slug,title,summary,body,category_id,status,source_document,source_pages,published_at) VALUES ('PEKB-030','skoda-portal-pekb-030','ŠKODA portal','How to check a part in the ŠKODA portal by part number and interpret the availability fields.','🚨 How to Track Parts on ŠKODA portal

Parts and Accessories II

Information > Information about part

Enter the part number in the material section then click on GO

Check:

Available in SPC

Available for sale

If it says At Disposal, then Part is available and will arrive within 7-10

If it says Not at Disposal, then part is not available','systems','published','BlueLight Cases-combined.pdf','88–89',CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-skoda-portal','ŠKODA portal','skoda-portal');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-skoda-portal');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-parts-and-accessories-ii','Parts and Accessories II','parts-and-accessories-ii');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-parts-and-accessories-ii');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-information-about-part','Information about part','information-about-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-information-about-part');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-material');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-at-disposal','At Disposal','at-disposal');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-at-disposal');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-not-at-disposal','Not at Disposal','not-at-disposal');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-not-at-disposal');
INSERT OR IGNORE INTO tags (id,name,slug) VALUES ('tag-spc','SPC','spc');
INSERT OR IGNORE INTO article_tags (article_id,tag_id) VALUES ('PEKB-030','tag-spc');
