//
//  WebViewController.h
//  chehaoyunV2.0
//
//  Created by 吴畏 on 15/12/9.
//  Copyright © 2015年 Frank ww. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AppDelegate.h"

@interface WebViewController : UIViewController<UIWebViewDelegate>

@property(nonatomic, strong)AppDelegate *myDelegate;

@property(nonatomic,copy)NSString *urlString;

@property(nonatomic)BOOL needNavigation;
@property(nonatomic,copy)NSString *titleName;

-(void)loadWeb;

@end
