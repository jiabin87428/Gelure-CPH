//
//  LodingView.h
//  chehaoyunV2.0
//
//  Created by 李家斌 on 15/12/7.
//  Copyright © 2015年 Frank ww. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LodingView : UIView

@property(nonatomic,strong)UIActivityIndicatorView *indicator;

//style:1为小的，2为宽的
- (id)initWithFrame:(CGRect)frame withStyle:(NSString *)style withTitle:(NSString *)title;

-(void)setLodingLabelText:(NSString *)textString;

@end
