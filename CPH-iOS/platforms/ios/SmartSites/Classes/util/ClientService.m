//
//  ClientService.m
//  SmartSites
//
//  Created by 李家斌 on 16/10/20.
//
//

#import "ClientService.h"
#import "AsynchronousRequestTool.h"
#import "FileDownLoadRequestTool.h"

static NSString *urlString;
static NSURL *url;

@implementation ClientService

#pragma mark 上传极光ID和UserID
+(void)sendJPushID:(NSString *)registrationId andUserID:(NSString *)userId withURL:(NSString *)urlstr withComplete:(completeBlock)complete{
    urlString = [NSString stringWithFormat:@"%@registrationid=%@&userid=%@",urlstr,registrationId,userId];
    url = [NSURL URLWithString:urlString];
    [AsynchronousRequestTool doRequestWithUrl:url AndParams:nil FinishCallbackBlock:^(NSData *received){
        if(received!=nil){
            NSDictionary *newDic = [NSJSONSerialization JSONObjectWithData:received options:NSJSONReadingMutableContainers error:nil];
            complete(newDic);
        }
    }];
}

#pragma mark 文件下载
+(void)downloadFile:(NSString *)urlString withName:(NSString *)name withComplete:(downLoadCompleteBlock)complete{
    urlString = [NSString stringWithFormat:@"%@",urlString];
    url = [NSURL URLWithString:urlString];
    FileDownLoadRequestTool *downLoadRequest = [[FileDownLoadRequestTool alloc] initWithBlock:^(int resultInt){
        complete(resultInt);
    }];
    //    NSArray *nameArr =  [urlString componentsSeparatedByString:name];
    [downLoadRequest downWithUrl:url withFileName:name];
}

@end
