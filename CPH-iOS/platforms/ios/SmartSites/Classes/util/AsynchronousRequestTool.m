//
//  AsynchronousRequestTool.m
//  at3client-ios
//
//  Created by LiJiabin on 15/10/14.
//  Copyright (c) 2015年 com.gelure. All rights reserved.
//

#import "AsynchronousRequestTool.h"

@implementation AsynchronousRequestTool
@synthesize receiveData, finishCallbackBlock;

static NSString * const FORM_FLE_INPUT = @"file";

+(void)doRequestWithUrl:(NSURL *)url AndParams:(id)params FinishCallbackBlock:(void (^)(NSData *))block{
    // 生成一个post请求回调委托对象（实现了<NSURLConnectionDataDelegate>协议）
    AsynchronousRequestTool *artDelegate = [[AsynchronousRequestTool alloc] init];
    artDelegate.finishCallbackBlock = block; // 绑定执行完成时的block
    
    //创建请求
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc]initWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10];
    if (params != nil) {
        [request setHTTPMethod:@"POST"];
        NSData *data;
        if ([params isKindOfClass:[NSString class]]) {
            data = [(NSString *)params dataUsingEncoding:NSUTF8StringEncoding];
        }else if([params isKindOfClass:[NSDictionary class]]){
            data = [NSJSONSerialization dataWithJSONObject:params options:0 error:nil];
        }else if([params isKindOfClass:[NSArray class]]){
            data =  [NSKeyedArchiver archivedDataWithRootObject:params];
        }else if([params isKindOfClass:[NSData class]]){
            data =  params;
        }
        [request setHTTPBody:data];
    }
    //第三步，连接服务器
    NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:artDelegate];
}

//接收到服务器回应的时候调用此方法
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response{
    self.receiveData = [NSMutableData data];
}

//接收到服务器传输数据的时候调用，此方法根据数据大小执行若干次
-(void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data{
    [self.receiveData appendData:data];
}

//数据传完之后调用此方法
-(void)connectionDidFinishLoading:(NSURLConnection *)connection{
    [[[UIApplication sharedApplication].keyWindow viewWithTag:5001] removeFromSuperview];
    NSDictionary *menuInfo = [NSJSONSerialization JSONObjectWithData:self.receiveData options:NSJSONReadingMutableContainers error:nil];
    
    if ([[menuInfo objectForKey:@"success"] isEqualToString:@"false"] && [[menuInfo objectForKey:@"msg"] isEqualToString:@"由于登录后长时间未操作，请重新登录！"]) {
        NSUserDefaults *settings = [NSUserDefaults standardUserDefaults];
        [settings removeObjectForKey:@"cookies"];
    }else{
        // 如果设置了回调的block，直接调用
        if (finishCallbackBlock) {
            finishCallbackBlock(self.receiveData);
        }
    }
}

//网络请求过程中，出现任何错误（断网，连接超时等）会进入此方法
-(void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error{
    NSLog(@"%@",[error localizedDescription]);
    [[[UIApplication sharedApplication].keyWindow viewWithTag:5001] removeFromSuperview];
    // 如果设置了回调的block，直接调用
    if (finishCallbackBlock) {
        finishCallbackBlock(nil);
    }
}

@end
