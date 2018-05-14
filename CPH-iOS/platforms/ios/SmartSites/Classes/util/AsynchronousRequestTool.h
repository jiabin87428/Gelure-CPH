//
//  AsynchronousRequestTool.h
//  at3client-ios
//
//  Created by LiJiabin on 15/10/14.
//  Copyright (c) 2015年 com.gelure. All rights reserved.
//

#import <Foundation/Foundation.h>

@class UIImage;
@interface AsynchronousRequestTool : NSObject<NSURLConnectionDataDelegate>{
    NSMutableData *receiveData; // 存放请求结果
    void (^finishCallbackBlock)(NSData *); // 执行完成后回调的block
}

//返回数据
@property NSMutableData *receiveData;

//执行完成后回调的block
@property(strong) void (^finishCallbackBlock)(NSData *);

//发送请求
+(void)doRequestWithUrl:(NSURL *)url AndParams:(id)params FinishCallbackBlock:(void (^)(NSData *))block;

@end
