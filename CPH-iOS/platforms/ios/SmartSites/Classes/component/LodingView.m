//
//  LodingView.m
//  chehaoyunV2.0
//
//  Created by 李家斌 on 15/12/7.
//  Copyright © 2015年 Frank ww. All rights reserved.
//

#import "LodingView.h"
#import <UIKit/UIKit.h>
@interface LodingView (){
    UILabel *lodingLabel;
}

@end


@implementation LodingView

//style:1为小的，2为宽的
- (id)initWithFrame:(CGRect)frame withStyle:(NSString *)style withTitle:(NSString *)title{
    if( (self = [super initWithFrame:frame]) ){
        UIView *bgView;
        if ([style isEqualToString:@"1"]) {
            bgView = [[UIView alloc]initWithFrame:CGRectMake(frame.size.width/2-30, frame.size.height/2-30, 70, 70)];
            lodingLabel = [[UILabel alloc]initWithFrame:CGRectMake(0, bgView.frame.size.height-30, 70, 30)];
        }else if([style isEqualToString:@"2"]){
            bgView = [[UIView alloc]initWithFrame:CGRectMake(frame.size.width/2-90, frame.size.height/2-30, 180, 70)];
            lodingLabel = [[UILabel alloc]initWithFrame:CGRectMake(0, bgView.frame.size.height-30, 180, 30)];
        }
        [bgView.layer setCornerRadius:10.0];
        bgView.backgroundColor = [UIColor darkGrayColor];
        bgView.alpha = 0.9;
        
        lodingLabel.textAlignment = NSTextAlignmentCenter;
        lodingLabel.text = title;
        lodingLabel.font = [UIFont systemFontOfSize:12.0];
        lodingLabel.textColor = [UIColor whiteColor];
        
        self.indicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
        self.indicator.transform = CGAffineTransformMakeScale(0.7, 0.7);
        // 设置指示器位置
        self.indicator.center = CGPointMake(bgView.frame.size.width/2, bgView.frame.size.height/2.5);
        [self addSubview:bgView];
        [bgView addSubview:self.indicator];
        [bgView addSubview:lodingLabel];
        //开启动画，必须调用，否则无法显示
        [self.indicator startAnimating];
    }
    return self;
}

-(void)setLodingLabelText:(NSString *)textString{
    lodingLabel.text = textString;
}

@end
