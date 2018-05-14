//
//  ElecContractController.h
//  chehaoyunV2.0
//
//  Created by 李家斌 on 15/11/20.
//  Copyright © 2015年 Frank ww. All rights reserved.
//  电子合同

#import <UIKit/UIKit.h>

@interface ElecContractController : UIViewController

//订单ID
@property(nonatomic,copy)NSString *orderID;

/**所要下载文件的总长度*/
@property (nonatomic, assign) NSInteger contentLength;
/**已下载文件的总长度*/
@property (nonatomic, assign) NSInteger currentLength;
/**文件句柄，用来实现文件存储*/
@property (nonatomic, strong) NSFileHandle *handle;

//Controller标题
@property(nonatomic,copy)NSString *vcTitle;
//pdf的url
@property(nonatomic,copy)NSString *pdfURL;
//无数据提示
@property(nonatomic,copy)NSString *tip;

@end
