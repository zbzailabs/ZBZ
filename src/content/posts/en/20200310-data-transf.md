---
title: "A Forced Data Migration"
description: "Pay attention to privacy protection, data should be backed up multiple times, and accounts should enable two-factor authentication"
category: "life"
tags:
  - "roam"
pubDate: 2020-03-10
heroImage: "https://cos.zbz.ai/images/202310181512073.avif"
heroImageAlt: "ZBZ-"
heroImageWidth: 1960
heroImageHeight: 1102
authors:
  - default
draft: false
featured: false
locale: "en"
---

###

### Event Restoration

On February 18, I received a notification from Taoluyun saying that the server account password was at risk and should be changed as soon as possible. Because the account has SMS verification, plus there were many things to do after resuming work, I didn't take the notification to heart.

On March 7, when I was preparing to update the article, I found that the server had been locked by Taoluyun. I asked for the reason and was told that the account payment method was at risk. I needed to provide my ID card, bound bank card, and the statement for the past month before trying to unlock it. At the same time, checking the bill, I found that the monthly subscription ECS had 2 dollars pending payment this month.

Taoluyun International does not support mainland bank cards and third-party payments. At that time, I could only use US Paypal to purchase. In order to prevent theft, after purchasing one cycle of ECS, I had already unbound PP and Taoluyun, and the association between PP and the bank card. Now to complete unlocking the server and paying the bill, I must bind PayPal and Taoluyun again. After many attempts to re-bind, PP always prompts "Unable to set up pre-approved payment temporarily". Googled it, it turned out that many people would encounter the same problem. PP official implemented risk control on the account. Whether it can be bound depends on fate.

After several failed attempts, I had to buy a new server at Liangxinyun and rebuild it. Thanks to the usual data backup, it took 3 hours to manually restore. During the data recovery process, some friends who subscribed to this site received a large number of old content RSS pushes. Please forgive me for the inconvenience caused to you. As for the locked Taoluyun and the bill, I can only think of other ways to solve it.

### Lesson

**Data needs multiple backups** No matter whether it is a cloud network disk, a server, or a local hard disk, there is a possibility of data loss. Important data should be backed up in at least three different locations. Pay special attention that if you back up locally, do not use SSD solid-state drives. Solid-state drive data cannot be recovered after loss. You can use mechanical hard drives or optical discs. When using cloud network disks, mainly check official announcements. Because it is difficult for cloud network disks to make a profit, some service providers may stop services at any time, so download and transfer your data in time. At present, the most conscientious network disks, I personally think are China Mobile's He Caiyun and Jianguoyun. Jianguoyun can be used for usual synchronization, and He Caiyun is used for data storage. For photo albums, you can use Google Photos.

**Accounts need to enable two-factor authentication** All kinds of accounts should enable two-factor authentication. Generally, two-factor authentication has two types: SMS and authenticator MFA. When using SMS verification, be clear about the service provider's operating area. Some service provider messages do not support +86 mobile phone numbers. You can also register a Google Voice to receive service provider verification messages. There are many authenticators, and it is recommended to use Microsoft's Authenticator, which is produced by a large manufacturer and supports account synchronization and recovery. When using the authenticator, the QR code method must be used for the first verification, and the QR code must be kept permanently. This QR code is permanently valid. When the phone is lost or the authenticator is reinstalled, it can be used again. It is not recommended to use Authy. Although it also supports backup, when logging in again, SMS verification is required, and sometimes +86 mobile phones cannot receive the verification code.
