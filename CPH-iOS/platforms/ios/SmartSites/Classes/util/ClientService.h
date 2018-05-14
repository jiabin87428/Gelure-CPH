//
//  ClientService.h
//  SmartSites
//
//  Created by 李家斌 on 16/10/20.
//
//

#import <Foundation/Foundation.h>

typedef void(^completeBlock)(NSDictionary *);
typedef void(^downLoadCompleteBlock)(int);

@interface ClientService : NSObject

#pragma mark 上传极光ID和UserID
+(void)sendJPushID:(NSString *)registrationId andUserID:(NSString *)userId withURL:(NSString *)urlstr withComplete:(completeBlock)complete;

#pragma mark 文件下载
+(void)downloadFile:(NSString *)urlString withName:(NSString *)name withComplete:(downLoadCompleteBlock)complete;

@end
